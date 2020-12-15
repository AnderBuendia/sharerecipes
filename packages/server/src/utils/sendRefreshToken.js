const sendRefreshToken = (res, token) => {
    res.cookie('jid', token, { maxAge: 900000*8, httpOnly: true }); 
}

module.exports = sendRefreshToken;