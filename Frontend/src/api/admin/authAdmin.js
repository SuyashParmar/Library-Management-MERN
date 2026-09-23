const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginAdmin = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Network or server error" };
  }
};

export const logoutAdmin = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: "Network or server error" };
  }
};
