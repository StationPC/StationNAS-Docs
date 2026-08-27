# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

# 依赖清单 + 全部源码
# 注意：npm ci 的 postinstall（fumadocs-mdx）需要 source.config.ts / content 生成 .source，
# 因此必须 COPY . . 之后再安装依赖
COPY package.json package-lock.json ./
COPY . .

RUN npm ci

# NEXT_PUBLIC_* 是构建时内联变量，通过 ARG 注入（来源：GitHub Actions build-args）
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# 产出 .next/standalone/ 可运行产物
RUN npm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# 以非 root 用户运行（最小权限）
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# 仅复制 standalone 运行时产物 + 静态资源 + 公共资源，控制镜像体积
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER nextjs
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
CMD ["node", "server.js"]
