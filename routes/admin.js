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
                        let company = "SELECT * FROM `businesses` WHERE `cadID` = '" + req.params.cadID + "'";
                        let postQ = "SELECT * FROM `posts` WHERE `cadID` = '" + req.params.cadID + "'";
                        let bolosQ = "SELECT * FROM `bolos` WHERE `cadID` = '" + req.params.cadID + "'";
                        connection1.query(`${query}; ${query2}; ${cadQ}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500)
                            } else {
                                connection.query(`${citizenQ}; ${weaponQ}; ${vehiclesQ}; ${chargesQ}; ${company}; ${postQ}; ${bolosQ}`, (err, result3) => {
                                    if (result[0][0].admin == 'moderator' || result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
                                        res.render("admin.ejs", { title: 'Admin Panel | SnailyCAD', isAdmin: result[0][0].admin, cadId: result2[0].cadID, users: result[1].length, cads: result[2], citizens: result3[0].length, weapons: result3[1].length, vehicles: result3[2].length, charges: result3[3].length, companies: result3[4].length, posts: result3[5].length, bolos: result3[6].length });
                                    } else {
                                        res.sendStatus(403);
                                    };
                                })
                            }


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

                                res.render("admin-pages/edit-citizens.ejs", { messageG: '', message: '', title: 'Admin Panel | Citizens', user: result[1], isAdmin: result[0][0].admin, cadId: result2[0].cadID, req: req })
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
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            console.log(result1);
                            
                            let query23 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                            connection1.query(query23, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        let id = req.params.id
                                        let query = "SELECT * FROM `users` WHERE id = '" + id + "'"
                                        let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "' AND cadID = '"+req.params.cadID+"'"
                                        let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let action_title = `Updated Permissions for ${result[1][0].username} by ${req.session.username2}.`
                        
                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"

                                        connection1.query(`${query2}; ${actionLog}`, (err, result2) => {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            } else {
                                                if (result2[0]) {
                                                    connection1.query(`${query1}; ${query}`, (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.sendStatus(500)
                                                        } else {
                                                            if (result[0][0].admin == 'admin' || result[0][0].admin == 'owner') {
    
                                                                res.render("admin-pages/edit-citizens.ejs", { messageG: 'Successfully saved changes', message: '', title: 'Edit User | SnailyCAD', user: result[1], isAdmin: result[0][0].admin, cadId: result2[0][0].cadID, req: req })
                                                            } else {
                                                                res.sendStatus(403)
                                                            };
                                                        }
                                                    });
                                                } else {
                                                    res.sendStatus(404)
                                                }
                                            }
                                        })
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

    },
    editCADPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"

            connection1.query(`${query}`, (err, result) => {
                if (result[0].admin == 'owner') {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.render("admin-pages/cad-settings.ejs", { messageG: '', message: '', title: "CAD Settings | Equinox CAD", isAdmin: result[0].admin, cadId: result2[0].cadID });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
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
    },
    editCAD: (req, res) => {
        let cad_name = req.body.cad_name
        let query4 = "UPDATE `cads` SET `cad_name` = '" + cad_name + "' WHERE `cadID` = '" + req.params.cadID + "'";

        let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'";
        connection1.query(`${query}`, (err, result) => {

            if (result[0].admin == 'owner') {
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            let date = new Date()
                            let currentD = date.toLocaleString();
                            let action_title = `CAD name was edited to "${cad_name}".`
            
                            let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + req.params.cadID + "', '" + currentD + "')"
                            connection1.query(`${query4}; ${actionLog}`, (err, result5) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    res.render("admin-pages/cad-settings.ejs", { messageG: 'Changes Successfully Saved', title: "CAD Settings | Equinox CAD", isAdmin: result[0].admin, cadId: result2[0].cadID });
                                };
                            });
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            } else {
                res.sendStatus(403)
            };
        });
    },
    deleteAllCitizens: (req, res) => {
        let cadID = req.params.cadID;
        let query = "DELETE FROM `citizens` WHERE `cadID` = '" + cadID + "'";

        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"

                let date = new Date()
                let currentD = date.toLocaleString();
                let action_title = `All Citizens were deleted by ${req.session.username2}.`

                let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + cadID + "', '" + currentD + "')"

                connection1.query(`${query}; ${actionLog}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    } else { 
                        if (result[0][0].admin == 'owner') {
                            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        res.render("admin-pages/cad-settings.ejs", { messageG: 'All Citizens Were Successfully Deleted.', title: "CAD Settings | Equinox CAD", isAdmin: result[0][0].admin, cadId: result2[0].cadID })
                                    } else {
                                        res.sendStatus(404);
                                    };
                                };
                            });
                        } else {
                            res.sendStatus(403)
                        };
                    }
                });
            }
        })
    },
    banUser: (req, res) => {
        let cadID = req.params.cadID;
        let userID = req.params.id;
        let banReason = req.body.reason

        let query4 = "SELECT * FROM `users` WHERE `cadID` = '" + cadID + "' AND `id` = '" + userID + "'";
        connection1.query(query4, (err, result4) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                if (req.session.username2 === result4[0].username) {
                    let id = req.params.id;
                    let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                    let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

                    connection1.query(query2, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                connection1.query(`${query1}; ${query};`, (err, result) => {
                                    res.render("admin-pages/edit-citizens.ejs", { message: 'You are not able to ban yourself.', messageG: '', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result[0].admin, cadId: result2[0].cadID, req: req });

                                });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
                } else {
                    let query = "UPDATE `users` SET `banned` = 'true', `ban_reason` = '" + banReason + "' WHERE `users`.`id` = '" + userID + "' AND `users`.`cadID` = '" + cadID + "'";

                    connection1.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            let id = req.params.id;
                            let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                            let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                            let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

                            connection1.query(query2, (err, result2) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                } else {
                                    if (result2[0]) {
                                        let date = new Date()
                                        let currentD = date.toLocaleString();
                                        let name = result4[0].username
                                        let action_title = `User ${name} was banned.`

                                        let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + cadID + "', '" + currentD + "')"
                                        connection1.query(`${query1}; ${query};`, (err, result) => {
                                            connection1.query(actionLog, (err, resultt) => {
                                                if (err) {
                                                    console.log(err);
                                                    return resS.sendStatus(500)
                                                } else {
                                                    res.render("admin-pages/edit-citizens.ejs", { message: '', messageG: `User was successfully banned. Reason: ${banReason}`, title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result[0].admin, cadId: result2[0].cadID, req: req });
                                                };
                                            });
                                        });
                                    } else {
                                        res.sendStatus(404);
                                    };
                                };
                            });
                        };
                    });
                };
            };
        });
    },
    unBanUser: (req, res) => {
        let cadID = req.params.cadID;
        let userID = req.params.id;
        let query = "UPDATE `users` SET `banned` = 'false', `ban_reason` = '' WHERE `users`.`id` = '" + userID + "' AND `users`.`cadID` = '" + cadID + "'";

        connection1.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                let id = req.params.id;
                let query = "SELECT * FROM `users` WHERE id = '" + id + "'";
                let query1 = "SELECT * FROM `users` WHERE username = '" + req.session.username2 + "'";
                let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'";

                connection1.query(query2, (err, result2) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    } else {
                        if (result2[0]) {
                            connection1.query(`${query1}; ${query};`, (err, result) => {
                                let date = new Date()
                                let currentD = date.toLocaleString();
                                let name = result[1][0].username
                                let action_title = `User ${name} was unbanned.`

                                let actionLog = "INSERT INTO `action_logs` (`action_title`, `cadID`, `date`) VALUES ('" + action_title + "', '" + cadID + "', '" + currentD + "')"
                                connection1.query(actionLog, (err, result22) => {
                                    if (err) {
                                        console.log(err);
                                        return res.sendStatus(500)
                                    } else {
                                        res.render("admin-pages/edit-citizens.ejs", { message: '', messageG: 'User was successfully unbanned.', title: 'Edit user | SnailyCAD', user: result[1], isAdmin: result[0].admin, cadId: result2[0].cadID, req: req });
                                    };
                                });
                            });
                        } else {
                            res.sendStatus(404);
                        };
                    };
                });
            };
        });
    },
    actionLogPage: (req, res) => {
        if (req.session.loggedin) {
            let query = "SELECT * FROM `users` WHERE `username` = '" + req.session.username2 + "' AND `cadID` = '" + req.params.cadID + "'"
            connection1.query(`${query}`, (err, result) => {
                if (result[0].admin == 'owner' || result[0].admin == 'admin' || result[0].admin == 'moderator') {
                    let query2 = "SELECT cadID FROM `users` WHERE cadID = '" + req.params.cadID + "'"
                    let query = "SELECT * FROM `action_logs` WHERE cadID = '" + req.params.cadID + "'"
                    connection1.query(`${query2}; ${query}`, (err, result2) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        } else {
                            if (result2[0]) {
                                res.render("admin-pages/action-logs.ejs", { messageG: '', message: '', title: "Action Logs | Equinox CAD", isAdmin: result[0].admin, cadId: result2[0][0].cadID, actions: result2[1] });
                            } else {
                                res.sendStatus(404);
                            };
                        };
                    });
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
                        res.redirect(`/cad/${result2[0].cadID}/login`);
                    } else {
                        res.sendStatus(404);
                    };
                };
            });
        };
    },
};
