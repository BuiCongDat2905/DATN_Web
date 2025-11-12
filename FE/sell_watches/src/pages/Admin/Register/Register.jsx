import classNames from 'classnames/bind';
import style from './Register.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import ModalMessage from '~/layouts/Component/ModalMessage';
import { useState } from 'react';
import { formatDob, validDob, validPhone } from '~/components/format';
import { postRegister } from '~/apiServices/Authentication/postRegister';

const cx = classNames.bind(style);
function Register() {
    const [modalMessage, setModalMessage] = useState({
        status: '',
        message: '',
        display: 'hiden',
    });
    const location = useNavigate();
    const [gender, setGender] = useState('Nam');
    const handlerInputRadio = (e) => {
        setGender(e);
    };
    const handlerRegister = (e) => {
        e.preventDefault();
        const data = e.target;
        if (!validPhone(data.soDienThoai.value)) {
            setModalMessage({
                status: 'warning',
                message: 'Số điện thoại không hợp lệ!',
                display: 'block',
            });
            return;
        }
        if (!formatDob(data.ngaySinh.value)) {
            setModalMessage({
                status: 'warning',
                message: 'Ngày sinh không hợp lệ!',
                display: 'block',
            });
            return;
        }
        const dataApi = {
            soDienThoai: data.soDienThoai.value,
            matKhau: data.matKhau.value,
            gioiTinh: data.gioiTinh.value,
            ngaySinh: formatDob(data.ngaySinh.value),
            email: data.email.value,
            tenNguoiDung: data.tenNguoiDung.value,
        };

        (async () => {
            try {
                const res = await postRegister(dataApi);
                if (res?.result) {
                    return location('/login');
                } else {
                    setModalMessage({
                        status: 'error',
                        message: 'Tài khoản đã tồn tại!',
                        display: 'block',
                    });
                }
            } catch (err) {
                console.log(err);
            }
        })();
    };
    const handlerClose = () => {
        setModalMessage((prev) => ({
            ...prev,
            display: 'hiden',
        }));
    };
    return (
        <div className={cx('login')}>
            <div className={`container ${cx('login-container')}`}>
                <div className={cx('logo')}>
                    <img src="https://i.imgur.com/2EdhZMd.png" alt="" />
                </div>
                <div className={cx('title')}>Đăng nhập</div>
                <form onSubmit={handlerRegister}>
                    <div className={cx('form-input')}>
                        <div className={cx('left')}>
                            <div className={`mb-3  ${cx('username')}`}>
                                <label htmlFor="exampleFormControlInput2" className={`form-label`}>
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleFormControlInput2"
                                    placeholder="Số điện thoại"
                                    name="soDienThoai"
                                    required
                                />
                            </div>
                            <div className={`mb-3`}>
                                <label htmlFor="inputPassword5" className="form-label">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="inputPassword5"
                                    className="form-control"
                                    aria-describedby="passwordHelpBlock"
                                    name="matKhau"
                                    required
                                />
                            </div>
                            <div className={`mb-3`}>
                                <label htmlFor="emailIp" className={`form-label`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailIp"
                                    placeholder="example@gmail.com"
                                    name="email"
                                    required
                                />
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div className="mb-3">
                                <label htmlFor="nameIp" className="form-label">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="nameIp"
                                    className="form-control"
                                    aria-describedby="passwordHelpBlock"
                                    placeholder="Nguyen Van A"
                                    name="tenNguoiDung"
                                    required
                                />
                            </div>
                            <div className={`mb-3  ${cx('username')}`}>
                                <label htmlFor="dobIp" className={`form-label`}>
                                    Ngày sinh
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="dobIp"
                                    placeholder="dd/mm/yyy"
                                    name="ngaySinh"
                                    required
                                />
                            </div>
                            <div className={`col-md-6 mb-4 ${cx('select')}`}>
                                <h6 className="mb-2 pb-1">Giới tính: </h6>
                                <div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gioiTinh"
                                            id="radioDefault1"
                                            value={'Nam'}
                                            checked={gender === 'Nam'}
                                            onChange={(e) => handlerInputRadio(e.target.value)}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="radioDefault1">
                                            Nam
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gioiTinh"
                                            id="radioDefault2"
                                            value={'Nữ'}
                                            checked={gender === 'Nữ'}
                                            onChange={(e) => handlerInputRadio(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="radioDefault2">
                                            Nữ
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gioiTinh"
                                            id="radioDefault3"
                                            value={'Khác'}
                                            checked={gender === 'Khác'}
                                            onChange={(e) => handlerInputRadio(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="radioDefault3">
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flexBoxColumCenter">
                        <button className={cx('btn')} type="submit">
                            Đăng ký
                        </button>
                        <div className={cx('create-acc')}>
                            <span>Bạn đã có tài khoản?</span>
                            <Link to={'/login'} className={cx('loginReturn')}>
                                {' '}
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
            <ModalMessage
                display={modalMessage?.display}
                status={modalMessage?.status}
                message={modalMessage?.message}
                onClose={handlerClose}
            />
        </div>
    );
}

export default Register;
