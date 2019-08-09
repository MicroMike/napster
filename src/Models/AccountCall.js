const AccountCall = {};

AccountCall.getAccount = function getAccount(access_token) {
    return new Promise(r => {
        fetch('https://api.napster.com/v2.2/me/account', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(result => r(result.account))
            .catch(err => Error(err, "Loading Genres"));
    })
};


export default AccountCall;
