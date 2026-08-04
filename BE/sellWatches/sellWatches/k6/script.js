import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1200'],
  },
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function browseProducts() {
  const url = `${BASE_URL}/products`;
  const res = http.get(url, { headers: { Accept: 'application/json' } });
  const ok = check(res, {
    'browse products status 200': (r) => r.status === 200,
    'browse products list not empty': (r) => {
      try {
        const result = r.json().result;
        return result && Object.keys(result).length > 0;
      } catch (e) {
        return false;
      }
    },
  });

  const ids = [];
  let sampleName = null;
  if (ok) {
    try {
      const body = res.json();
      for (const category in body.result) {
        const list = body.result[category];
        for (let i = 0; i < list.length && ids.length < 10; i++) {
          const item = list[i];
          if (!sampleName && item) {
            sampleName = item.ten_san_pham || item.ma_san_pham || item.id;
          }
          if (item && item.id) ids.push(item.id);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  return { ids, sampleName };
}

function searchProducts(query) {
  const url = `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&page=0&size=20`;
  const res = http.get(url, { headers: { Accept: 'application/json' } });
  check(res, {
    'search products status 200': (r) => r.status === 200,
    'search results not empty': (r) => {
      try {
        const result = r.json().result;
        return result && result.searchProductResponse && result.searchProductResponse.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  return res;
}

function viewProduct(id) {
  const url = `${BASE_URL}/products/${id}`;
  const res = http.get(url, { headers: { Accept: 'application/json' } });
  check(res, {
    'view product status 200': (r) => r.status === 200,
    'view product has id': (r) => {
      try {
        const product = r.json().result;
        return product && (product.id || product.ma_san_pham || product.ten_san_pham);
      } catch (e) {
        return false;
      }
    },
  });
  return res;
}

export default function () {
  group('Public product flow', function () {
    const { ids, sampleName } = browseProducts();
    sleep(randomInt(1, 3));

    if (ids.length > 0) {
      const sampleId = ids[randomInt(0, ids.length - 1)];
      viewProduct(sampleId);
      sleep(1);
      const query = sampleName || 'Citizen';
      searchProducts(query);
      sleep(1);
    } else {
      searchProducts('Citizen');
      sleep(1);
    }
  });
}
