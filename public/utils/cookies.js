function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row. startsWith(name + "="))
        ?.split("=")[1];
}

function clearCookie(name, path = '/', domain = '') {
    if (document.cookie.indexOf (name + "=") === -1) {
        console.log(`Cookie '$(name)' not found.`);
        return;
    }

      let expiry = new Date(0).toUTCString(); 

            // Construct the deletion string
            let cookieString = name + '=; expires=' + expiry;

            // Append optional path (required to match original cookie setting)
            if (path) {
                cookieString += '; path=' + path;
            }

            // Append optional domain (required to match original cookie setting)
            if (domain) {
                cookieString += '; domain=' + domain;
            }

            // Set the cookie, which triggers deletion
            document.cookie = cookieString;
            updateCookieDisplay(); // Refresh UI

            console.log(`Cookie '${name}' cleared using: ${cookieString}`);
            document.getElementById('setMsg').textContent = `Cookie cleared: ${name}`;

}