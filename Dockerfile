# Sử dụng Node.js 18 phiên bản slim để giảm kích thước image
FROM node:18-slim

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies, sử dụng `--only=production` nếu chỉ cần chạy mà không build TypeScript
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn (trừ những thứ đã bị ignore)
COPY . .

# Mở cổng cho server
EXPOSE 4000

# Chạy ứng dụng (nếu dùn thì sửa lại)
CMD ["npm", "run", "start"]
