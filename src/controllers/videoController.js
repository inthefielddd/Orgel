import Video from "../models/Video";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ createdAt: "desc" });
        return res.render("home", { pageTitle: "Home", videos });
    } catch (error) {
        return res.render("server-error");
    }
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    //비디오가 없을때는 에러가 나니까
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found" });
    }
    return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found" });
    }
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found" });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            createdAt: Date.now(),
            hashtags: Video.formatHashtags(hashtags),
            meta: {
                views: 0,
                rating: 0,
            },
        });
        return res.redirect("/");
    } catch (error) {
        return res.status(404).render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    //delete video
    //다시 홈으로 보내야함
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    //keyword가 없을때 videos가 undefind가 되면 에러갈 날 수 있기때문에
    //videos를 밖에다가 설정해주고 video가 있을때 videos에 업데이트가 되게해준다
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        });
    }
    return res.render("search", { pageTitle: "Search", videos });
};
