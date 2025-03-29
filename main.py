from quart import Quart, render_template, redirect, session, request
from supabase import create_client, Client
import os
from datetime import datetime
import traceback

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
app = Quart(__name__)
app.secret_key = "vttiic810xUU2J9aOKcYCXQSFH1e12bxGlcY3MNhookMNAK1sI"


def get_traceback(error):
    etype = type(error)
    trace = error.__traceback__
    lines = traceback.format_exception(etype, error, trace)
    return "".join(lines)


@app.before_request
async def refresh_token():
    if session.get("logged_in"):
        expires_at = session.get("expires_at", 0)
        if datetime.utcnow().timestamp() > expires_at - 60:
            try:
                session_data = supabase.auth.refresh_session()
                session["expires_at"] = session_data.session.expires_at
            except Exception as e:
                print(get_traceback(e))
                session.pop("logged_in", None)
                session.pop("user", None)
                return await render_template(
                    "error.html", message="Session expired, please login again"
                )


@app.route("/")
async def index():
    if session.get("logged_in"):
        return await render_template("index.html", logged_in=True)

    return await render_template("index.html")


@app.route("/login")
async def login():
    if session.get("logged_in"):
        return redirect("/")

    return await render_template("login.html")


@app.route("/login-callback")
async def login_callback():
    access_token = request.args.get("access_token")
    refresh_token = request.args.get("refresh_token")
    expires_at = request.args.get("expires_at")

    if access_token is None or refresh_token is None:
        return redirect("/login")

    try:
        supabase.auth.set_session(access_token, refresh_token)
        user = supabase.auth.get_user().user

        if user:
            session["user"] = {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at,
                "confirmed_at": user.confirmed_at,
            }
            session["logged_in"] = True
            session["expires_at"] = int(expires_at)
            return redirect("/")
        else:
            return await render_template("error.html", message="Invalid user found")

    except Exception as e:
        return await render_template(
            "error.html", message="Login failed with error: " + str(e)
        )


@app.route("/userInfo")
async def userInfo():
    if not session.get("logged_in"):
        return redirect("/")

    return session.get("user"), 200


@app.route("/transport")
async def transport():
    if not session.get("logged_in"):
        return redirect("/")

    return await render_template("transport.html", user=session.get("user"))


@app.route("/transportDistanceForm")
async def transportDistanceForm():
    if not session.get("logged_in"):
        return redirect("/")

    car_type = request.args.get("car_type")
    vehicle_number = request.args.get("vehicle_number")
    vehicle_type = request.args.get("vehicle_type")

    if not car_type or not vehicle_number or not vehicle_type:
        return await render_template(
            "error.html",
            message="Missing required fields(car_type, vehicle_number, vehicle_type)",
        )

    if car_type not in ["petrol", "diesel", "ev", "LPG", "CNG"]:
        return await render_template(
            "error.html",
            message="Invalid car type, must be petrol, diesel, Hybrid, CNG or electric",
        )

    if vehicle_type not in ["two-wheeler", "four-wheeler", "heavy-vehicle"]:
        return await render_template(
            "error.html",
            message="Invalid vehicle type, must be two-wheeler, four-wheeler or heavy-vehicle",
        )

    if len(vehicle_number) < 5:
        return await render_template(
            "error.html",
            message="Invalid vehicle number, must be at least 5 characters",
        )

    return await render_template("transportDistanceForm.html", user=session.get("user"))


def calculateCarbonEmission(car_type, vehicle_type, distance):
    fuel_efficiency = {"two-wheeler": 50, "four-wheeler": 15, "heavy-vehicle": 5}
    emission_factor = {
        "petrol": 2.27,
        "diesel": 3.17,
        "Hybrid": 1.0,
        "CNG": 0.05,
        "ev": 0,
    }
    return (distance / fuel_efficiency[vehicle_type]) * emission_factor[car_type]


@app.route("/transportUserInfo")
async def transportUserInfo():
    if not session.get("logged_in"):
        return redirect("/")

    data = {
        "id": session["user"]["id"],
        "emailId": session["user"]["email"],
        "vehicleNumber": request.args.get("vehicle_number"),
        "vehicleType": request.args.get("vehicle_type"),
        "fuelType": request.args.get("fuel_type"),
        "distanceTravelled": request.args.get("distance_travelled"),
        "averageSpeed": "-- km/h",
        "carbonEmission": calculateCarbonEmission(
            request.args.get("vehicle_type"),
            request.args.get("fuel_type"),
            float(request.args.get("distance_travelled")),
        ),
    }
    return data, 200


@app.route("/transportDashboard")
async def transportDashboard():
    if not session.get("logged_in"):
        return redirect("/")

    car_type = request.args.get("car_type")
    vehicle_number = request.args.get("vehicle_number")
    vehicle_type = request.args.get("vehicle_type")
    distance = request.args.get("distance")

    if not car_type or not vehicle_number or not vehicle_type:
        return await render_template(
            "error.html",
            message="Missing required fields(car_type, vehicle_number, vehicle_type)",
        )

    if car_type not in ["petrol", "diesel", "ev"]:
        return await render_template(
            "error.html", message="Invalid car type, must be petrol, diesel or electric"
        )

    if vehicle_type not in ["two-wheeler", "four-wheeler", "heavy-vehicle"]:
        return await render_template(
            "error.html",
            message="Invalid vehicle type, must be two-wheeler, four-wheeler or heavy-vehicle",
        )

    if len(vehicle_number) < 5:
        return await render_template(
            "error.html",
            message="Invalid vehicle number, must be at least 5 characters",
        )

    if not distance or not distance.isdigit():
        return await render_template(
            "error.html",
            message="Invalid field distance, must be a number and greater than 0",
        )

    print(f"Logged in as {session['user']['email']}")
    print(f"User ID: {session['user']['id']}")
    result = (
        supabase.table("transport")
        .select("userid, distance, carbonemitted, timestamp")
        .eq("userid", session["user"]["id"])
        .order("timestamp", desc=True)
        .execute()
    )
    if not result:
        return await render_template(
            "error.html", message="No data found for this user"
        )

    return await render_template(
        "transportDashboard.html",
        user=session.get("user"),
    )


@app.route("/agriculture")
async def agriculture():
    if not session.get("logged_in"):
        return redirect("/")

    print(f"Logged in as {session['user']['email']}")
    print(f"User ID: {session['user']['id']}")
    result = (
        supabase.table("agriculture")
        .select("co2, ch4, voc, timestamp, userid")
        .eq("userid", session["user"]["id"])
        .order("timestamp", desc=True)
        .execute()
    )
    if not result:
        return await render_template(
            "error.html", message="No data found for this user"
        )
    data = result.data
    last_record = data[0] if data else None
    second_last_record = data[1] if data else None
    percent_change = (
        last_record["co2"] - second_last_record["co2"] if second_last_record else 0
    )
    print(result)
    return await render_template(
        "agriculture.html",
        user=session.get("user"),
        current_carbon=100,
        percent_change=percent_change,
        sensor_data=last_record["co2"],
    )


@app.route("/register")
async def register():
    return await render_template("register.html")


@app.route("/faq")
async def faq():
    return await render_template("faq.html")


@app.route("/GPSTracker")
async def GPSTracker():
    return await render_template("GPSTracker.html")


@app.route("/maps")
async def maps():
    return await render_template("maps.html")


@app.route("/forgot-password")
async def forgot_password():
    return await render_template("forgot-password.html")


@app.route("/logout")
async def logout():
    session.pop("logged_in", None)
    session.pop("puuid", None)
    return redirect("/")
