import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";

export default function CustomFooter () {
    return  <footer className="bg-[#f4f4f4] mx-6 mb-6 rounded-xl text-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-zinc-800">Turbans & Traditions</h3>
          <p className="text-zinc-500">
            Discover authentic cultural experiences across the globe.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 hover:text-white transition-colors"
            >
              <BsFacebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 hover:text-white transition-colors"
            >
              <BsInstagram size={24} />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 hover:text-white transition-colors"
            >
              <BsWhatsapp size={24} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-zinc-800">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-zinc-500 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-500 hover:text-white">
                Destinations
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-500 hover:text-white">
                Packages
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-500 hover:text-white">
                About Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-zinc-800">Contact</h4>
          <address className="text-zinc-500 not-italic">
            99 Delhi Tower
            <br />
            Ghaziabad, UP 201001
            <br />
            contact@turbansandtraditions.com
            <br />
            +91 9898979797
          </address>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-zinc-800">Subscribe</h4>
          <p className="text-zinc-500 mb-4">
            Stay updated with our latest offers
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-md focus:outline-none text-zinc-800 w-full"
            />
            <button className="bg-black hover:bg-zinc-900 px-4 py-2 rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-400 mt-8 pt-8 text-center text-zinc-600">
        <p>
          &copy; {new Date().getFullYear()} Turbans & Traditions. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
}