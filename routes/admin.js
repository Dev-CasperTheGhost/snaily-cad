module.exports = {
    adminPanel: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        let query = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                        let query2 = "SELECT * FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                        let citizenQ = "SELECT * FROM `citizens` WHERE cadID = '" + req.params.cadID + "'";
                        let cadQ = "SELECT * FROM `cads` WHERE cadID = '" + req.params.cadID + "'"
                        let weaponQ = "SELECT * FROM `registered_weapons` WHERE cadID = '" + req.params.cadID + "'";
                        let vehiclesQ = "SELECT * FROM `registered_cars` WHERE cadID = '" + req.params.cadID + "'";
                        let chargesQ = "SELECT * FROM `posted_charges` WHERE cadID = '" + req.params.cadID + "'";
                        connection1.query(`${query}; ${query2}; ${cadQ}`, (err, result) => {
                            connection.query(`${citizenQ}; ${weaponQ}; ${vehiclesQ}; ${chargesQ}`, (err, result3) => {
                                if (result[0][0].admin == 'moderator' || result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
                                    res.render("admin.ejs", { title: 'Admin Panel | SnailyCAD', isAdmin: result[0][0].admin, cadId: result2[0].cadID, users: result[1].length, cads: result[2], citizens: result3[0].length, weapons: result3[1].length, vehicles: result3[2].length, charges: result3[3].length });
                                } else {
                                    res.sendStatus(403);
                                };
                            })


                        });
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }
    },
    usersPage: (req, res) => {
        if (req.session.loggedin) {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            let query = "SELECT * FROM `users` WHERE cadID = '" + req.params.cadID + "' ORDER BY id ASC"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        connection1.query(`${query1}; ${query}`, (err, result) => {
                            if (result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
                                res.render("admin-pages/citizens.ejs", { title: 'Admin Panel | Citizens', users: result[1], isAdmin: result[0][0].admin, cadId: result2[0].cadID })
                            } else {
                                res.sendStatus(403)
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })


        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }


    },
    adminEditCitizenPage: (req, res) => {
        if (req.session.loggedin) {
            let id = req.params.id
            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"

            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        connection1.query(`${query1}; ${query}`, (err, result) => {
                            if (result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
                                res.render("admin-pages/edit-citizens.ejs", { title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].admin, cadId: result2[0].cadID, req: req })
                            } else {
                                res.sendStatus(403)
                            };
                        });
                    } else {
                        res.sendStatus(404)
                    }
                }
            })

        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }

    },
    adminEditCitizen: (req, res) => {
        if (req.session.loggedin) {
            let id = req.params.id
            let admin = req.body.admin
            if (admin == undefined) {
                admin = "admin"
            }
            let leo = req.body.leo
            let ems = req.body.ems
            let dispatch = req.body.dispatch

            let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'"
            let query2 = 'UPDATE `users` SET `admin` = "' + admin + '", `leo` = "' + leo + '", `ems_fd` = "' + ems + '", `dispatch` = "' + dispatch + '" WHERE `users`.`id` = "' + id + '"';
            connection1.query(`${query1}; ${query}`, (err, result) => {
                if (result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
                    connection1.query(query2, (err, result1) => {
                        if (err) {
                            res.sendStatus(500)
                        } else {
                            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        res.redirect(`/cad/${result2[0].cadID}/admin/users`)
                                    } else {
                                        res.sendStatus(404)
                                    }
                                }
                            })

                        }
                    })
                } else {
                    res.sendStatus(403)
                };
            });
        } else {
            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
            connection1.query(query2, (err, result2) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    if (result2[0]) {
                        res.redirect(`/cad/${result2[0].cadID}/login`)
                    } else {
                        res.sendStatus(404)
                    }
                }
            })
        }

    }

}
