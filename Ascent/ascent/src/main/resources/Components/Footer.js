export default function Footer() {

    // Get the email address from localStorage
    const email = localStorage.getItem('email');

    // Split the email address into an array using the dot as the delimiter
    const emailParts = email.split('.');

    // Get the first letter of the first name and capitalize it
    const firstNameInitial = emailParts[0][0].toUpperCase();

    // Get the first letter of the last name and capitalize it
    const lastNameInitial = emailParts[1][0].toUpperCase();

    // Concatenate the initials to create the desired format
    const initials = `${firstNameInitial}${lastNameInitial}`;


    return <nav className="footer">
        <div className="footerLeft">
            <div className="ascentLogo"></div>
            <a href="/Home" className="site-title">Ascent</a>
        </div>
        <div className="footerRight">
            <div className="userBubble">
                <p>{initials}</p>
            </div>
            <p className="versionAndCopyright">Version : 0.0.1<br/>© 2023 WESTERN DIGITAL </p>
        </div>


    </nav>
}
