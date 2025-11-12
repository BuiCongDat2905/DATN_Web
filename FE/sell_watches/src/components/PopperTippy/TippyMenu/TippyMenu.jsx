import React from 'react';
import classNames from 'classnames/bind';
import style from './TippyMenu.module.scss';
import { Link } from 'react-router-dom';
import { validUrl } from '~/components/format';

const cx = classNames.bind(style);

const TippyMenu = React.forwardRef(({ content, onMouseEnter, onMouseLeave }, ref) => {
    return (
        <div
            ref={ref}
            className={`wrapper ${cx('tippyMenu')}`}
            style={Object.keys(content) < 1 ? { display: 'none' } : { display: 'block' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {content['image'] ? (
                <div className={cx('tippyMenu_container')}>
                    {Object.values(content).map((value, index) => {
                        if (!!value && typeof value === 'string') {
                            return (
                                <div className={cx('menuItem_img')} key={index}>
                                    <Link>
                                        <img src={value} alt="" />
                                    </Link>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            ) : (
                <div className={cx('tippyMenu_container')}>
                    {Object.keys(content).map((value, index) => {
                        if (!!value && index !== 0) {
                            return (
                                <div key={index} className={cx('menuItem_list')}>
                                    <span>{value}</span>
                                    <div className="line-90"></div>
                                    <div className={cx('menuItem_item')}>
                                        {content[value].map((valueArr, indexArr) => {
                                            return (
                                                <span key={indexArr}>
                                                    <Link to={validUrl(valueArr)}>{valueArr}</Link>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
});

export default TippyMenu;
