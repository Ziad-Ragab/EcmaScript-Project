document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logoutBtn");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            // تأكيد من المستخدم قبل تسجيل الخروج
            const confirmLogout = confirm("Are you sure you want to logout?");
            
            if (confirmLogout) {
                // مسح بيانات المستخدم من localStorage (اختياري)
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                localStorage.removeItem("password");
                
                // توجيه المستخدم إلى صفحة Login
                window.location.href = "../index.html"; // تعديل المسار حسب هيكل ملفاتك
            }
        });
    }
});