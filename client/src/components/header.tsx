function Header() {
  return (
    <header>
      <div className="flex justify-between items-center">
        <img src="#" alt="logo" />
        <h1>Your Ecommerce</h1>
        <input type="search" placeholder="cerca un prodotto..." />
        <button>Log in</button> //porta alla pagina di login
        <button>Sign up</button> //porta alla pagina di registrazione
        <button>☾</button>
      </div>
    </header>
  );
}

export default Header;
