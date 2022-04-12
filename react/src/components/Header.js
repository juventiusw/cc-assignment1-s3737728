import Carousel from 'react-bootstrap/Carousel';

export default function Header() {
    return (
        <header>
            <Carousel>
                <Carousel.Item style={{'height':"750px"}}>
                    <img alt="1st slide" className="d-block w-100" style={{'height':"750px"}} src={'https://a1-react-assets.s3.amazonaws.com/canmandawe-ftTsK4QinMw-unsplash.jpg'} />
                    <Carousel.Caption>
                        <h1>Greetings!</h1>
                        <p>- Welcome to Travel Chalk, a place where people from around the world can have a talk / discussion about travelling and adventuring in our beautiful planet. -</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{'height':"750px"}}>
                    <img alt="2nd slide" className="d-block w-100" style={{'height':"750px"}} src={'https://a1-react-assets.s3.amazonaws.com/zak-boca-_o-iJvRlqzI-unsplash.jpg'} />
                    <Carousel.Caption>
                        <h2>COVID-19</h2>
                        <p>The COVID-19 pandemic has made a great impact on each of our lives, no matter where we live in the world. Now that more people throughout the world are getting vaccinated against the virus, the travel industry is starting to kick off again as countries are easing travel restrictions on tourists.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{'height':"750px"}}>
                    <img alt="3rd slide" className="d-block w-100" style={{'height':"750px"}} src={'https://a1-react-assets.s3.amazonaws.com/duy-pham-Cecb0_8Hx-o-unsplash.jpg'} />
                    <Carousel.Caption>
                        <h3>Travel Chalk</h3>
                        <p>- Since people are becoming increasingly eager to pack their bags and discover new places, Travel Chalk aims to provide a friendly network where people can resolve their doubts about travelling and share past experiences with each other during this difficult time. -</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </header>
    );
}