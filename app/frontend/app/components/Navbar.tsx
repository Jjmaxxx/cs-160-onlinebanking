function Navbar() {
     return (<nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">BANK</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/maps" className="hover:text-gray-400">Find ATMs</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
        </div>
      </nav>);
}

export default Navbar;