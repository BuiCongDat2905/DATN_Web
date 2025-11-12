import { parse, format } from "date-fns";

export const validUrl = (urlValue) => {
    if (urlValue === null || typeof urlValue !== 'string') {
        return "";
    }
    urlValue = urlValue.toLowerCase();
    urlValue = urlValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    urlValue = urlValue.replace(/đ/g, 'd');
    urlValue = urlValue.replace(/[()\\{}]/g, "");
    urlValue = urlValue.split(" ").join("-");
    return urlValue;
}
export const formatUrlToLink = (url) => {
    if (url === undefined) {
        return "";
    }
    url = url.trim()
    url = url.replace("/", "")
    url = url.replace(/-/g, " ");
    const linkTo = url.split("/");
    return linkTo;
}
export const formatLink = (link) => {
    link = link.toLowerCase();
    link = link.replace(/ /g, "-");
    return `/${link}`;
}
export const formatNumber = (number) => {
    if (number) {
        if (typeof number === 'string') {
            number = Number(number.replace(/\D/g, ""));
            return number.toLocaleString('vi-VN');
        }
        return number.toLocaleString('vi-VN');
    }
    return 0;
}
export const validEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
}
export const validPhone = (value) => {
    const regex = /^0\d{9,10}$/;
    return regex.test(value);
}
export const validPassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
    return regex.test(value);
};
export const validDob = (value) => {
    const dob = new Date(value)
    const today = new Date()

    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 18
}
export const formatDob = (value) => {
    const formats = ["dd/MM/yyyy", "dd-MM-yyyy", "yyyy.MM.dd", "dd MM yyyy"];
    const today = new Date();
    for (const fmt of formats) {
        try {
            const parsedDate = parse(value, fmt, new Date());
            if (today.getFullYear() - parsedDate.getFullYear >= 100) {
                console.log(today.getFullYear() - parsedDate.getFullYear());
                return false;
            }
            return format(parsedDate, "yyyy-MM-dd");
        } catch (error) {
            return false;
        }
    }

    return "Invalid Date";
}
export const formatSearch = (value) => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}
export const fomatPriceFilter = (value) => {
    const price = {
        min: null,
        max: null
    }
    const match = value.match(/(\d+(?:[.,]\d+)?)/);
    if (value.includes("dưới")) {
        if (match) {
            const max = Number(match[1].replace(",", "."));
            price.max = max;
            return price
        }

    }
    if (value.includes("trên")) {
        if (match) {
            const min = Number(match[1].replace(",", "."));
            price.min = min;
            return price
        }
    }
    if (value.includes("từ")) {
        const regex = /(\d+)\s*triệu\s*đến\s*(\d+)\s*triệu/i;
        const match2 = value.match(regex);
        if (match2) {
            price.min = Number(match2[1]);
            price.max = Number(match2[2]);
            return price
        }
    }

    return price;
}
export const formatDiameter = (value) => {
    const diameter = {
        min: null,
        max: null
    }

    if (/dưới\s*(\d+)/i.test(value)) {
        const match = value.match(/dưới\s*(\d+)/i);
        diameter.max = parseInt(match[1]);
    } else if (/(\d+)\s*mm\s*đến\s*(\d+)/i.test(value)) {
        const match = value.match(/(\d+)\s*mm\s*đến\s*(\d+)/i);
        diameter.min = parseInt(match[1]);
        diameter.max = parseInt(match[2]);
    } else if (/từ\s*(\d+)/i.test(value)) {
        const match = value.match(/từ\s*(\d+)/i);
        diameter.min = parseInt(match[1]);
    }

    return diameter;
}
export const formatFilterValue = (value) => {
    if (value) {
        return value
            .normalize("NFD")
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .split(" ")
            .map((word, index) =>
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join("");
    }

}
export const formatDateDashboard = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }

    return date.toISOString().split('T')[0];
};
export const formatSnakeToCamle = (value) => {
    return value.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

}