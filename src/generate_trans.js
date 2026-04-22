
const fs = require('fs');

const items = JSON.parse(fs.readFileSync('d:\\\\Code làm việc\\\\test\\\\Albion\\\\src\\\\items.json', 'utf8'));

// Function to translate common phrases for items
function translateItemDetail(detail) {
    let d = detail.toLowerCase();
    if (d.includes('tốt')) detail = detail.replace(/tốt/gi, 'good');
    if (d.includes('khá')) detail = detail.replace(/khá/gi, 'quite');
    if (d.includes('rất')) detail = detail.replace(/rất/gi, 'very');
    if (d.includes('mạnh')) detail = detail.replace(/mạnh/gi, 'strong');
    if (d.includes('phù hợp')) detail = detail.replace(/phù hợp/gi, 'suitable');
    if (d.includes('thường dùng')) detail = detail.replace(/thường dùng/gi, 'commonly used');
    if (d.includes('đánh')) detail = detail.replace(/đánh/gi, 'fight');
    if (d.includes('phế vật')) detail = detail.replace(/phế vật/gi, 'useless');
    if (d.includes('đáy xã hội')) detail = detail.replace(/đáy xã hội/gi, 'bottom of society');
    return detail;
}

const itemTranslationsVi = {};
const itemTranslationsEn = {};

for (const id in items) {
    itemTranslationsVi[id] = {
        name: items[id].name,
        detail: items[id].detail
    };
    itemTranslationsEn[id] = {
        name: items[id].name,
        detail: translateItemDetail(items[id].detail)
    };
}

const viContent = `export const VnScript = {
    trans: {
        test: 'thử'
    },
    common: {
        vi: 'Tiếng việt',
        en: 'Tiếng Anh',
        searchPlaceholder: 'Tìm kiếm...',
        loading: 'Đang tải...',
        detail: 'Chi tiết',
        name: 'Tên',
        detailLabel: 'Chi tiết:',
        cancel: 'Hủy',
        save: 'Lưu',
        viFull: 'Việt Nam',
        enFull: 'English',
        recent: 'Gần đây',
        categories: 'Danh mục',
        logout: 'Đăng xuất',
        theMist: 'The Mist',
        normal: 'Bình thường'
    },
    login: {
        title: 'Chào mừng bạn tới với XHCN',
        user: 'Người dùng',
        password: 'Mật Khẩu',
        forgotPassword: 'Quên mật khẩu',
        login: 'Đăng nhập',
        or: 'Hoặc',
        continue: 'Tiếp tục với google',
        haveAccount: 'Bạn không có tài khoản ?',
        signUp: 'Đăng ký',
        message1: 'Vui lòng điền vào ô người dùng',
        message2: 'Vui lòng điền vào ô mật khẩu',
        createProfileError: 'Lỗi khi tạo hồ sơ. Vui lòng thử lại.',
        loadProfileError: 'Không thể tải hồ sơ người dùng. Vui lòng thử lại.'
    },
    register: {
        title: 'Chào mừng bạn tới với XHCN',
        email: 'Email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        messageEmail: 'Vui lòng nhập Email!',
        messageEmailInvalid: 'Email không hợp lệ!',
        messagePassword: 'Vui lòng nhập Mật khẩu!',
        messagePasswordMin: 'Mật khẩu phải có ít nhất 6 ký tự!',
        messageConfirmPassword: 'Vui lòng xác nhận mật khẩu!',
        messageConfirmPasswordMismatch: 'Mật khẩu xác nhận không khớp!',
        signUpSuccess: 'Tạo tài khoản thành công! Vui lòng kiểm tra email để xác nhận.',
        signUp: 'Đăng ký',
        or: 'Hoặc',
        continueWithGoogle: 'Tiếp tục với Google',
        alreadyHaveAccount: 'Bạn đã có tài khoản?',
        login: 'Đăng nhập'
    },
    loading: 'Đang tải dữ liệu ...',
    teammate: {
        delete: 'Xoá đội',
        changeName: 'Sửa tên đội',
        addTeam: 'Thêm đội mới',
        teamName: 'Nhập tên đội',
        deleteLastError: 'Không thể xóa team cuối cùng.',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa team "{name}"?',
        teamNameEmptyError: 'Tên team không được để trống.'
    },
    video: {
        loading: 'Đang tải video...',
        categoryHighlight: 'Highlight',
        categoryFunny: 'Funny Moment',
        categoryRecord: 'Record',
        upload: 'Tải lên',
        uploadTitle: 'Tải lên Video',
        titleLabel: 'Tiêu đề Video',
        urlLabel: 'YouTube URL',
        descLabel: 'Mô tả',
        messageTitle: 'Vui lòng nhập tiêu đề video!',
        messageUrl: 'Vui lòng nhập URL YouTube!',
        messageUrlInvalid: 'Vui lòng nhập URL hợp lệ!',
        messageDesc: 'Vui lòng nhập mô tả!'
    },
    youtube: {
        placeholder: 'Dán link YouTube vào đây...'
    },
    build: {
        title: 'Bạn cần một build mới?',
        subtitle: 'Xem các build meta mới nhất cho các hoạt động khác nhau trong Albion Online.',
        viewBuilds: 'Xem Build',
        anime: 'Anime hoá',
        guide: 'Hướng dẫn Build',
        selectItemPrompt: 'Vui lòng chọn một vật phẩm để xem chi tiết.',
        hellgate: 'HellGate 5v5 (2v2)',
        corrupted: 'Corrupted Dungeon',
        openworld: 'OpenWorld'
    },
    aboutUs: {
        loadUsersError: 'Lỗi khi tải danh sách người dùng.',
        manageUsers: 'Quản lý Người dùng',
        cuDoTribe: 'Bộ lạc Cu Đỏ',
        noUsersFound: 'Không có người dùng nào trong nhóm này.',
        detailInfo: 'Thông tin chi tiết',
        admin: 'Quản trị viên',
        member: 'Thành viên',
        selectUserPrompt: 'Vui lòng chọn một người dùng để xem thông tin'
    },
    settings: {
        adminDashboard: 'Bảng điều khiển Admin',
        adminAccess: 'Bạn có quyền truy cập quản trị.',
        myProfile: 'Hồ sơ của tôi',
        firstName: 'Tên',
        lastName: 'Họ',
        messageFirstName: 'Vui lòng nhập tên của bạn!',
        messageLastName: 'Vui lòng nhập họ của bạn!',
        upload: 'Tải lên',
        remove: 'Xóa',
        accountSecurity: 'Bảo mật tài khoản',
        password: 'Mật khẩu',
        changePassword: 'Đổi mật khẩu',
        supportAccess: 'Hỗ trợ truy cập',
        deleteAccountTitle: 'Xóa tài khoản của tôi',
        deleteAccountDesc: 'Xóa vĩnh viễn tài khoản và xóa quyền truy cập khỏi tất cả các không gian làm việc.',
        deleteAccountButton: 'Xóa tài khoản',
        fetchProfileError: 'Lỗi khi lấy thông tin hồ sơ. Vui lòng kiểm tra kết nối hoặc thiết lập profiles.',
        unauthenticatedError: 'Người dùng chưa được xác thực.',
        uploadAvatarSuccess: 'Tải ảnh đại diện thành công!',
        removeAvatarSuccess: 'Đã xóa ảnh đại diện thành công!',
        updateProfileSuccess: 'Cập nhật hồ sơ thành công!',
        changePasswordTitle: 'Thay đổi mật khẩu',
        enterNewPassword: 'Vui lòng nhập mật khẩu mới:',
        passwordLengthError: 'Mật khẩu phải có ít nhất 6 ký tự.',
        passwordChangeSuccess: 'Mật khẩu đã được đổi thành công!',
        deleteAccountConfirm: 'Bạn có chắc chắn muốn xóa tài khoản?',
        deleteAccountWarning: 'Thao tác này sẽ xóa vĩnh viễn tài khoản của bạn và không thể hoàn tác.',
        deleteAccountSuccess: 'Tài khoản đã được xóa thành công.'
    },
    sidebar: {
        navigation: 'Điều hướng',
        home: 'Trang chủ',
        team: 'Đội',
        video: 'Video',
        retroTV: 'RetroTV',
        builds: 'Builds',
        aboutUs: 'Về chúng tôi',
        settings: 'Cài đặt'
    },
    footer: {
        directory: 'Danh mục:',
        contact: 'Liên hệ:',
        contactUs: 'Liên hệ với chúng tôi:',
        copyright: '© {year} XHCN Guild - ASIA Server'
    },
    items: ${JSON.stringify(itemTranslationsVi, null, 4)}
}`;

const enContent = `export const EnglishScript = {
    trans: {
        test: 'test'
    },
    common: {
        vi: 'Vietnamese',
        en: 'English',
        searchPlaceholder: 'Search...',
        loading: 'Loading...',
        detail: 'Detail',
        name: 'Name',
        detailLabel: 'Detail:',
        cancel: 'Cancel',
        save: 'Save',
        viFull: 'Vietnamese',
        enFull: 'English',
        recent: 'Recent',
        categories: 'Categories',
        logout: 'Log Out',
        theMist: 'The Mist',
        normal: 'Normal'
    },
    login: {
        title: 'Welcome to XHCN',
        user: 'User',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
        login: 'Log In',
        or: 'Or',
        continue: 'Continue with google',
        haveAccount: 'Don&apos;t have account?',
        signUp: 'Sign Up',
        message1: 'Please input your Username!',
        message2: 'Please input your Password!',
        createProfileError: 'Error creating profile. Please try again.',
        loadProfileError: 'Unable to load user profile. Please try again.'
    },
    register: {
        title: 'Welcome to XHCN',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        messageEmail: 'Please input your Email!',
        messageEmailInvalid: 'The input is not a valid E-mail!',
        messagePassword: 'Please input your Password!',
        messagePasswordMin: 'Password must be at least 6 characters!',
        messageConfirmPassword: 'Please confirm your password!',
        messageConfirmPasswordMismatch: 'The two passwords that you entered do not match!',
        signUpSuccess: 'Account created successfully! Please check your email for confirmation.',
        signUp: 'Sign Up',
        or: 'OR',
        continueWithGoogle: 'Continue with Google',
        alreadyHaveAccount: 'Already have an account?',
        login: 'Log in'
    },
    loading: 'Loading ...',
    teammate: {
        delete: 'Delete Team',
        changeName: 'Change Team Name',
        addTeam: 'Add New Team',
        teamName: 'Name ...',
        deleteLastError: 'Cannot delete the last team.',
        deleteConfirm: 'Are you sure you want to delete team "{name}"?',
        teamNameEmptyError: 'Team name cannot be empty.'
    },
    video: {
        loading: 'Loading videos...',
        categoryHighlight: 'Highlight',
        categoryFunny: 'Funny Moment',
        categoryRecord: 'Record',
        upload: 'Upload',
        uploadTitle: 'Upload Video',
        titleLabel: 'Video Title',
        urlLabel: 'YouTube URL',
        descLabel: 'Description',
        messageTitle: 'Please enter the video title!',
        messageUrl: 'Please enter the YouTube URL!',
        messageUrlInvalid: 'Please enter a valid URL!',
        messageDesc: 'Please enter a description!'
    },
    youtube: {
        placeholder: 'Paste YouTube link here...'
    },
    build: {
        title: 'Need a new build?',
        subtitle: 'Check out the latest meta builds for different activities in Albion Online.',
        viewBuilds: 'View Builds',
        anime: 'Anime Style',
        guide: 'Build Guide',
        selectItemPrompt: 'Please select an item to view details.',
        hellgate: 'HellGate 5v5 (2v2)',
        corrupted: 'Corrupted Dungeon',
        openworld: 'OpenWorld'
    },
    aboutUs: {
        loadUsersError: 'Error loading user list.',
        manageUsers: 'User Management',
        cuDoTribe: 'Cu Do Tribe',
        noUsersFound: 'No users found in this group.',
        detailInfo: 'Detailed Information',
        admin: 'Administrator',
        member: 'Member',
        selectUserPrompt: 'Please select a user to view information'
    },
    settings: {
        adminDashboard: 'Admin Dashboard',
        adminAccess: 'You have administrative access.',
        myProfile: 'My Profile',
        firstName: 'First Name',
        lastName: 'Last Name',
        messageFirstName: 'Please enter your first name!',
        messageLastName: 'Please enter your last name!',
        upload: 'Upload',
        remove: 'Remove',
        accountSecurity: 'Account Security',
        password: 'Password',
        changePassword: 'Change Password',
        supportAccess: 'Support Access',
        deleteAccountTitle: 'Delete my account',
        deleteAccountDesc: 'Permanently delete the account and remove access from all workspaces.',
        deleteAccountButton: 'Delete Account',
        fetchProfileError: 'Error fetching profile information. Please check your connection or profile settings.',
        unauthenticatedError: 'User not authenticated.',
        uploadAvatarSuccess: 'Avatar uploaded successfully!',
        removeAvatarSuccess: 'Avatar removed successfully!',
        updateProfileSuccess: 'Profile updated successfully!',
        changePasswordTitle: 'Change Password',
        enterNewPassword: 'Please enter a new password:',
        passwordLengthError: 'Password must be at least 6 characters.',
        passwordChangeSuccess: 'Password changed successfully!',
        deleteAccountConfirm: 'Are you sure you want to delete your account?',
        deleteAccountWarning: 'This action will permanently delete your account and cannot be undone.',
        deleteAccountSuccess: 'Account deleted successfully.'
    },
    sidebar: {
        navigation: 'Navigation',
        home: 'Home',
        team: 'Team',
        video: 'Video',
        retroTV: 'RetroTV',
        builds: 'Builds',
        aboutUs: 'About Us',
        settings: 'Settings'
    },
    footer: {
        directory: 'Directory:',
        contact: 'Contact:',
        contactUs: 'Contact Us:',
        copyright: '© {year} XHCN Guild - ASIA Server'
    },
    items: ${JSON.stringify(itemTranslationsEn, null, 4)}
}`;

fs.writeFileSync('d:\\\\Code làm việc\\\\test\\\\Albion\\\\src\\\\hooks\\\\vi.ts', viContent, 'utf8');
fs.writeFileSync('d:\\\\Code làm việc\\\\test\\\\Albion\\\\src\\\\hooks\\\\en.ts', enContent, 'utf8');
