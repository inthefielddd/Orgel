import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const { email, username, password, password2, name, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(404).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }

    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(404).render("join", {
            //
            pageTitle,
            errorMessage: "This username/email is already taken",
        });
    }
    try {
        await User.create({
            email,
            username,
            password,
            name,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(404).render("join", { pageTitle, errorMessage: error._message });
    }
};

export const getLogin = (req, res) => res.render("Login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    //check if account exists
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username dose not exists." });
    }
    //check if password correct
    //(입력한 비밀번호, 암호화된 비밀번호)
    const ok = await bcrypt.compare(password, user.password);
    //만약 입력한 비밀번호가 같지 않다면
    if (!ok) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Wrong Password" });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const edit = (req, res) => res.send("User Edit");
export const deleteUser = (req, res) => res.send("User Delete");
export const see = (req, res) => res.send("See User");
export const logout = (req, res) => res.send("Log out");
