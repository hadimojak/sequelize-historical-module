const publicIp = require('public-ip');

exports.findIp = async () => {
    const userIp = await publicIp.v4();
    return userIp;
};

