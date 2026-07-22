import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import style from './AccountInfo.module.scss';
import { IconClose2, IconUser } from '~/components/icon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { postGetInfo } from '~/apiServices/Authentication/postGetInfo';
import { postIntrospect } from '~/apiServices/Authentication/postIntrospect';
import { postLogin } from '~/apiServices/Authentication/postLogin';
import { postLogout } from '~/apiServices/Authentication/postLogout';
const cx = classNames.bind(style);
function AccountInfo() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies();
    const [userData, setUserData] = useState({});
    const [isHiden, setIsHiden] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    useEffect(() => {
        setIsModalOpen(false);
    }, [location.pathname]);
    useEffect(() => {
        const token = cookies.token;
        if (token) {
            (async () => {
                try {
                    const res = await postIntrospect(token);
                    if (res?.result?.valid === true) {
                        return setIsHiden(false);
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
        setIsHiden(true);
    }, []);
    useEffect(() => {
        const token = cookies.token;
        if (token && !isHiden) {
            (async () => {
                try {
                    const res = await postGetInfo({ name: token });
                    if (res?.result) {
                        const result = res.result;
                        setUserData({
                            useId: result.soDienThoai,
                            fullName: result.tenKhachHang,
                            email: result.email,
                            dateOfBirth: result.ngaySinh,
                            shippingAddress: result.diaChi,
                            gender: result.gioiTinh,
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [isModalOpen]);
    const hanlderLogout = () => {
        (async () => {
            try {
                const token = cookies.token;
                const res = await postLogout(token);
                // removeCookies('token');
                navigate('/login');
            } catch (err) {
                console.log(err);
            }
        })();
    };
    return (
        <div className={`${cx('containerInfo')}`}>
            <div className={cx('avata')} onClick={toggleModal}>
                {!isHiden ? (
                    <img
                        src=""
                        // src="https://readdy.ai/api/search-image?query=Professional%20portrait%20photo%20of%20a%20young%20man%20with%20short%20brown%20hair%20and%20friendly%20smile%2C%20high%20quality%20professional%20headshot%20on%20neutral%20background%2C%208k%20ultra%20HD%20quality%2C%20professional%20lighting&width=200&height=200&seq=1&orientation=squarish"
                        alt="User avatar"
                    />
                ) : (
                    <IconUser />
                )}

                {isHiden ? (
                    <div className={cx('login')}>
                        <Link to={'/login'}>Đăng nhập</Link>
                    </div>
                ) : (
                    <span>{userData.useId}</span>
                )}
            </div>
            {isModalOpen && !isHiden && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fadeIn relative">
                        <div className="flex items-center justify-center pt-8 pb-6 border-b border-gray-200">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full border-4 border-blue-100 overflow-hidden mb-3">
                                    <img
                                        src="https://readdy.ai/api/search-image?query=Professional%20portrait%20photo%20of%20a%20young%20man%20with%20short%20brown%20hair%20and%20friendly%20smile%2C%20high%20quality%20professional%20headshot%20on%20neutral%20background%2C%208k%20ultra%20HD%20quality%2C%20professional%20lighting&width=200&height=200&seq=2&orientation=squarish"
                                        alt="User avatar"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {userData.useId}
                                </h2>
                            </div>
                            <div className={`${cx('iconClose')} absolute top-4 right-4 cursor-pointer`} onClick={toggleModal}>
                                <IconClose2 />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Họ và tên</span>
                                    <span className="font-medium text-gray-800 font-semibold">
                                        {userData.fullName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email</span>
                                    <span className="font-medium text-gray-800 font-semibold">
                                        {userData.email}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày sinh</span>
                                    <span className="font-medium text-gray-800 font-semibold">
                                        {userData.dateOfBirth}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giới tính</span>
                                    <span className="font-medium text-gray-800 font-semibold">
                                        {userData.gender}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                Địa chỉ giao hàng
                            </h3>
                            {userData?.shippingAddress !== '' ? (
                                <p className="text-gray-800 font-semibold">{userData.shippingAddress}</p>
                            ) : (
                                <button type="button" className="btn btn-info text-white">
                                    Cập nhật địa chỉ
                                </button>
                            )}
                        </div>

                        <div className="px-6 py-2">
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer">
                                    <div className="flex items-center">
                                        <i className="fas fa-user-edit text-blue-500 w-6"></i>
                                        <span className="ml-3 text-gray-700">
                                            Cập nhật thông tin tài khoản
                                        </span>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </button>

                                <Link
                                    to={'/lich-su'}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-amber-500 w-6"></i>
                                        <span className="ml-3 text-gray-700">Lịch sử đơn hàng</span>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </Link>

                                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer">
                                    <div className="flex items-center">
                                        <i className="fas fa-lock text-purple-500 w-6"></i>
                                        <span className="ml-3 text-gray-700">Đổi mật khẩu</span>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </button>

                                <button
                                    onClick={hanlderLogout}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <i className="fas fa-sign-out-alt text-red-500 w-6"></i>
                                        <span className="ml-3 text-gray-700">Đăng xuất</span>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl text-center text-sm text-gray-500">
                            Last login: May 19, 2025 • 10:45 AM
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountInfo;
