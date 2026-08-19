import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useBook } from "../../../context/BookContext";
import { requestBookApi, getDashboardApi } from "../../../api/book/borrowApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BooksSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { books, loading, fetchBooks, page, totalPages, setPage } = useBook();

  const [search, setSearch] = useState("");
  const [selectedPDF, setSelectedPDF] = useState(null);

  // 🤖 AI Search State
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // 🔥 New States
  const [requesting, setRequesting] = useState({});
  const [borrowMap, setBorrowMap] = useState({});

  // 💳 Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookForBuy, setSelectedBookForBuy] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  // 📚 Fetch Books
  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  // 🔥 Fetch Borrow Status (REAL DATA)
  useEffect(() => {
    const fetchBorrowData = async () => {
      if (!user) return; // Only fetch borrow data if logged in
      try {
        const res = await getDashboardApi();

        const map = {};
        res.borrows.forEach((b) => {
          map[b.book._id] = b.status; // pending / approved / returned
        });

        setBorrowMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBorrowData();
  }, [user]);

  // 🔍 Filter books (Local + AI)
  const filteredBooks = useMemo(() => {
    if (aiSearchResults !== null) {
      return books?.filter(book => aiSearchResults.includes(book._id)) || [];
    }
    return (
      books?.filter(
        (book) =>
          book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [books, search, aiSearchResults]);

  // Reset AI search when text is empty
  useEffect(() => {
    if (!search) setAiSearchResults(null);
  }, [search]);

  // 🤖 Perform AI Search
  const handleAiSearch = async () => {
    if (!search) return;
    setIsAiSearching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/ai/search?q=${search}`);
      const data = await res.json();
      setAiSearchResults(data.ids || []);
    } catch (e) {
      console.error(e);
      alert("AI Search failed.");
    } finally {
      setIsAiSearching(false);
    }
  };

  // 📥 Borrow Request
  const handleBorrow = async (bookId) => {
    if (!user) {
      navigate("/register");
      return;
    }
    
    try {
      setRequesting((prev) => ({ ...prev, [bookId]: true }));

      const res = await requestBookApi(bookId);

      if (res.message === "Request sent") {
        setBorrowMap((prev) => ({
          ...prev,
          [bookId]: "pending",
        }));
      }

      alert(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setRequesting((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>

      {/* Search Bar & AI Search Button */}
      <div className="mb-6 flex gap-3 w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search by title, or ask AI (e.g. 'dystopian society')..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
        />
        <button
          onClick={handleAiSearch}
          disabled={isAiSearching || !search}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:bg-purple-300"
        >
          {isAiSearching ? "Thinking..." : "✨ AI Search"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Availability</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-400">
                  Loading books...
                </td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => {
                const status = borrowMap[book._id];

                return (
                  <tr key={book._id} className="border-t hover:bg-gray-50">
                    {/* Book */}
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={book.coverImage?.startsWith("http") ? book.coverImage : `${BASE_URL}${book.coverImage}`}
                        className="w-12 h-16 rounded-md object-cover shadow-sm"
                        onError={(e) => (e.target.src = "/no-image.jpg")}
                      />
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">
                          {book.author}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs">
                        {book.category}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="p-4">
                      {book.bookType === "physical" && (
                        <span>
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                      )}

                      {book.bookType === "digital" && (
                        <span className="text-blue-600 font-medium">
                          PDF Available
                        </span>
                      )}

                      {book.bookType === "both" && (
                        <span>
                          {book.availableCopies}/{book.totalCopies} + PDF
                        </span>
                      )}
                    </td>

                    {/* 🔥 Status */}
                    <td className="p-4">
                      {status === "pending" && (
                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      )}

                      {status === "approved" && (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                      )}

                      {status === "returned" && (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                          Returned
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center space-x-3">
                      {/* 📖 Read */}
                      {(book.bookType === "digital" ||
                        book.bookType === "both") && (
                        <button
                          onClick={() => {
                            if (!user) {
                              navigate("/register");
                              return;
                            }
                            setSelectedPDF(`${BASE_URL}${book.pdfUrl}`);
                          }}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Read
                        </button>
                      )}

                      {/* 📥 Borrow */}
                      {(book.bookType === "physical" ||
                        book.bookType === "both") && (
                        <button
                          disabled={
                            book.availableCopies === 0 ||
                            requesting[book._id] ||
                            status === "pending" ||
                            status === "approved"
                          }
                          onClick={() => handleBorrow(book._id)}
                          className={`text-sm ${
                            book.availableCopies === 0
                              ? "text-gray-400"
                              : status === "pending"
                                ? "text-yellow-600"
                                : status === "approved"
                                  ? "text-emerald-600"
                                  : "text-emerald-600 hover:text-emerald-800"
                          }`}
                        >
                          {requesting[book._id]
                            ? "Sending..."
                            : book.availableCopies === 0
                              ? "Out of Stock"
                              : status === "pending"
                                ? "Requested"
                                : status === "approved"
                                  ? "Borrowed"
                                  : "Borrow"}
                        </button>
                      )}

                      {/* 💳 Buy */}
                      {(book.bookType === "physical" || book.bookType === "both") && (
                        <button
                          onClick={() => {
                            if (!user) {
                              navigate("/register");
                              return;
                            }
                            setSelectedBookForBuy(book);
                            setShowPaymentModal(true);
                            setPaymentStatus("idle");
                          }}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-3 py-1 rounded-full ml-2"
                        >
                          Buy ($14.99)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              page === i + 1 ? "bg-emerald-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 📖 PDF Viewer */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden">
            <div className="flex justify-between p-3 border-b">
              <h3 className="font-semibold">Reading Book</h3>
              <button onClick={() => setSelectedPDF(null)}>Close ✕</button>
            </div>

            <iframe src={selectedPDF} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* 💳 Fake Payment Modal */}
      {showPaymentModal && selectedBookForBuy && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] md:w-[400px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Secure Checkout</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-white hover:text-gray-200 text-xl font-bold">✕</button>
            </div>

            <div className="p-6">
              {paymentStatus === "idle" && (
                <>
                  <div className="flex gap-4 items-center mb-6 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <img src={selectedBookForBuy.coverImage?.startsWith("http") ? selectedBookForBuy.coverImage : `${BASE_URL}${selectedBookForBuy.coverImage}`} className="w-12 h-16 rounded object-cover shadow-sm" />
                    <div>
                      <div className="font-bold text-sm text-gray-800">{selectedBookForBuy.title}</div>
                      <div className="text-purple-700 font-bold">$14.99</div>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    setPaymentStatus("processing");
                    setTimeout(() => setPaymentStatus("success"), 1500);
                  }}>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                      <input required type="text" placeholder="**** **** **** ****" maxLength="19" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                        <input required type="text" placeholder="MM/YY" maxLength="5" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                        <input required type="password" placeholder="***" maxLength="4" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                      Pay $14.99
                    </button>
                  </form>
                </>
              )}

              {paymentStatus === "processing" && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Processing Payment...</p>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <span className="text-5xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
                  <p className="text-gray-600 text-sm">Your purchase of <br/><span className="font-semibold text-gray-900 text-base">"{selectedBookForBuy.title}"</span><br/> has been confirmed.</p>
                  
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl font-medium w-full mt-4 text-sm shadow-sm flex flex-col gap-2">
                    <svg className="w-6 h-6 mx-auto text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Please collect your book from the library reception.
                  </div>
                  
                  <button onClick={() => setShowPaymentModal(false)} className="mt-6 text-gray-500 hover:text-gray-800 font-medium underline text-sm transition-colors">
                    Close Window
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksSection;
