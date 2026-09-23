export default function Footer() {
  return (
    <footer id="footer" className="bg-emerald-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">

        {/* About */}
        <div>
          <h2 className="text-xl font-semibold text-white">SmartLibrary</h2>
          <p className="mt-3 text-sm">
            A modern library management system built using MERN stack for
            managing books, students and records digitally.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Home</li>
            <li>Books</li>
            <li>Dashboard</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <p className="text-sm mt-3"> support@smartlibrary.com</p>
          <p className="text-sm"> India</p>
        </div>

      </div>

      <div className="text-center border-t border-gray-700 py-4 text-sm">
         {new Date().getFullYear()} SmartLibrary | Developed by Suyash Parmar
      </div>
    </footer>
  );
}
