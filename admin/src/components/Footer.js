import React from "react";

export default function Footer() {
    return (
        <footer className="mt-auto pt-4 pb-2 text-white"  style={{ backgroundColor: "#292B2C" }}>
            <div className="container">
                <p className="float-left">&copy; 2022 Admin Travel Chalk, Inc.</p>
                <p className="float-right"><a href="#top">Back to top</a></p>
            </div>
        </footer>
    );
}
