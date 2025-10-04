import { useState } from 'react';
import Header from './Pages/Header/Header.jsx';
import MovieList from './Pages/MovieCard/MovieList.jsx';
import ShowList from './Pages/ShowList/ShowList.jsx'; // We will create this next
import BookingPage from './Pages/BookingPage/BookingPage';
import LoginPage from './Pages/Login/Login'; // Assuming LoginPage is in its own folder
import MyBookingsPage from './Pages/MyBookingsPage/MyBookingsPage';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('home');
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  const handleLoginSuccess = (userData) => setCurrentUser(userData);
  const handleSignOut = () => setCurrentUser(null);

  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
    setSelectedMovieId(null);
    setSelectedShow(null);
    setView('home');
  };

  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
    setSelectedShow(null);
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
    setView('booking');
  };

  const handleGoBack = () => {
    setSelectedShow(null);
    setView('home'); // Go back to the home/browsing view
  };
  
  const showBookings = () => setView('my-bookings');
  const goHome = () => {
    setView('home');
    setSelectedCityId(null); // Reset selections
    setSelectedMovieId(null);
    setSelectedShow(null);
  };

  if (!currentUser) {
    return <div className="app-container"><LoginPage onLoginSuccess={handleLoginSuccess} /></div>;
  }
  
  return (
    <div>
      <Header 
        user={currentUser} 
        onCitySelect={handleCitySelect} 
        onSignOut={handleSignOut}
        onShowBookings={showBookings}
        onGoHome={goHome}
      />
      <main className="app-container">
        {view === 'home' && (
          <>
            <MovieList cityId={selectedCityId} onMovieSelect={handleMovieSelect} />
            {selectedMovieId && <ShowList cityId={selectedCityId} movieId={selectedMovieId} onShowSelect={handleShowSelect} />}
          </>
        )}
        {view === 'booking' && <BookingPage show={selectedShow} user={currentUser} onGoBack={handleGoBack} />}
        {view === 'my-bookings' && <MyBookingsPage user={currentUser} />}
      </main>
    </div>
  );
}

export default App;