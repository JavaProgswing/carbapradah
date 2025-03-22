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


# access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6InpiZzBZNzhob29tejloWnYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2NkcW50bnhoeXBwd2hua2JzbXh1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlOTQxNGQxMC1lNjRiLTRjOWYtYjJkNS1mNWMzYmQzYjJiOWEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQyMDU2ODQwLCJpYXQiOjE3NDIwNTMyNDAsImVtYWlsIjoieWFzaGFzdmlhbGxlbmt1anVyQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJ5YXNoYXN2aWFsbGVua3VqdXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiZTk0MTRkMTAtZTY0Yi00YzlmLWIyZDUtZjVjM2JkM2IyYjlhIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQyMDUzMjQwfV0sInNlc3Npb25faWQiOiI1ZjBhNThmOC1jMDQ0LTQ1YTctOTE4NC0xNDRmODhmYjMzZDUiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.sjAiubAfI9ck0jEk3_GoHlBcutSs9UpP5xURf9LK98g
# expires_at=1742056840
# refresh_token=Qf45LkkemAsJjubeFDyMwQ
@app.route("/login-callback")
async def login_callback():
    access_token = request.args.get("access_token")
    refresh_token = request.args.get("refresh_token")
    expires_at = request.args.get("expires_at")

    if not access_token or not refresh_token:
        return await render_template(
            "error.html", message="Missing required fields(access_token, refresh_token)"
        )

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


@app.route("/transport")
async def transport():
    if not session.get("logged_in"):
        return redirect("/")

    return await render_template("transport.html", user=session.get("user"))


@app.route("/transportDashboard")
async def transportDashboard():
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

    return await render_template(
        "transportDashboard.html",
        user=session.get("user"),
    )


@app.route("/agriculture")
async def agriculture():
    if not session.get("logged_in"):
        return redirect("/")

    return await render_template("agriculture.html", user=session.get("user"))


@app.route("/register")
async def register():
    return await render_template("register.html")


@app.route("/faq")
async def faq():
    return await render_template("faq.html")


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
