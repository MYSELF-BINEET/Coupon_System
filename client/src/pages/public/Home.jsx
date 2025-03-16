import React from 'react';
import HomePage from '../../components/public/HomePage';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default Home;