window.onload = function () {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    // ถ้ายังไม่ได้เข้าสู่ระบบ, ไปหน้า auth.html
    if (!userLoggedIn) {
        window.location.href = 'auth.html';
    } else {
        userName = localStorage.getItem('userName'); // ดึง userName จาก Local Storage
        $("#welcome").html(`Welcome back, ${userName}`);
        $("#userName").html(userName);
    }
};
//------------------------------------------------------------//
function logout() {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to logout!",
        imageUrl: "assets/img/illustrations/sammy-no-connection.gif",
        imageWidth: 300,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, Logout!",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("userLoggedIn");
            window.location.reload();
        }
    });
}