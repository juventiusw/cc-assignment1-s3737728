import React from "react";

export default function Home(props) {
    return (
        <div className="container marketing pt-5">
            <div className="row">
                <div className="col-lg-4">
                    <img className="rounded-circle" src={'https://a1-react-assets.s3.amazonaws.com/discussion.png'} width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="discussion"/>
                    <h2>Access the Discussion Board</h2>
                    <p>The discussion board is a place where people can discuss about all of their concerns. Users can search for posts in the forum or browse recent posts made by other users.</p>
                    <p><a className="btn btn-secondary" href="#access_the_discussion_board">View details &raquo;</a></p>
                </div>
                <div className="col-lg-4">
                    <img className="rounded-circle" src={'https://a1-react-assets.s3.amazonaws.com/edit-profile.png'} width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="edit-profile"/>
                    <h2>Customize your Profile</h2>
                    <p>If you're logged in, you can head to the My Profile page and customize your profile based on your preferences.</p>
                    <p><a className="btn btn-secondary" href="#customize_your_profile">View details &raquo;</a></p>
                </div>
                <div className="col-lg-4">
                    <img className="rounded-circle" src={'https://a1-react-assets.s3.amazonaws.com/register-login.png'} width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="register-login"/>
                    <h2>Register &amp; Login</h2>
                    <p>In order to post a discussion, users need to be logged in. You can create an account by going to the Register page of this website.</p>
                    <p><a className="btn btn-secondary" href="#register_login">View details &raquo;</a></p>
                </div>
            </div>

            <hr className="featurette-divider mt-5 mb-5" id="access_the_discussion_board"/>

            <div className="row featurette">
                <div className="col-md-7">
                    <h2 className="featurette-heading">Access the Discussion Board<span className="text-muted">, and see for yourself.</span></h2>
                    <p className="lead">The Discussion Board is the most important element of this website. Please head over to the discussion board to explore posts created by other users. If you're logged in, you can also reply to a post in the Discussion Board.</p>
                </div>
                <div className="col-md-5">
                    <img className="featurette-image img-fluid mx-auto" src={'https://a1-react-assets.s3.amazonaws.com/christin-hume-mfB1B1s4sMc-unsplash.jpg'} width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="landing-image1" />
                </div>
            </div>

            <hr className="featurette-divider mt-5 mb-5" id="customize_your_profile"/>

            <div className="row featurette">
                <div className="col-md-7 order-md-2">
                    <h2 className="featurette-heading">Customize your Profile.<span className="text-muted">This is a given.</span></h2>
                    <p className="lead">Authorised users are naturally allowed to edit their own profile information using a form similar to the signup form. Not only that, you can also delete your account, too. However, if you end up deleting your account, all of your data must be deleted as well, so be careful.</p>
                </div>
                <div className="col-md-5 order-md-1">
                    <img className="featurette-image img-fluid mx-auto" src={'https://a1-react-assets.s3.amazonaws.com/malte-helmhold-W0LtTCq1UjQ-unsplash.jpg'} width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="landing-image2" />
                </div>
            </div>

            <hr className="featurette-divider mt-5 mb-5" id="register_login"/>

            <div className="row featurette mb-5">
                <div className="col-md-7">
                    <h2 className="featurette-heading">Register &amp; Login. <span className="text-muted">Join the community, it's free!</span></h2>
                    <p className="lead">What are you waiting for? If you haven't done so, go ahead and register an account by entering your name, email, username, and password. After registering, you will be automatically logged in to your account. If you already have an account, simply head to the Login page &amp; enter your username and password. It's as simple as that.</p>
                </div>
                <div className="col-md-5">
                    <img className="featurette-image img-fluid mx-auto" src={'https://a1-react-assets.s3.amazonaws.com/derek-oyen-3Xd5j9-drDA-unsplash.jpg'} width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" alt="landing-image3" />
                </div>
            </div>

        </div>
    );
}
