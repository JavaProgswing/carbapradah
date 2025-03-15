from quart import Quart, render_template, redirect, session

app = Quart(__name__)


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


@app.route("/register")
async def register():
    return await render_template("register.html")


@app.route("/faq")
async def faq():
    return await render_template("faq.html")


@app.route("/reset-password")
async def reset_password():
    return await render_template("reset-password.html")


@app.route("/logout")
async def logout():
    session.pop("logged_in", None)
    session.pop("puuid", None)
    return redirect("/")
