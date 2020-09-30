import React from 'react';
import '../css/app.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class Settings extends React.Component {  
    render() {
        return (
            <div>
                <Header />
                <h2><Link to="delete" class="button">Delete Account</Link></h2>
                <Footer />
            </div>
        )
    }
}