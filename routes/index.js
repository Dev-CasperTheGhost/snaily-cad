module.exports = {
    homePage: (req, res) => {
        res.render("index.ejs", { title: "Home | Equinox CAD" })
    },

}