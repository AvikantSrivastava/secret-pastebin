FROM denoland/deno:alpine-2.2.3

WORKDIR /app

COPY . .
RUN deno cache main.ts

USER deno
EXPOSE 8000

CMD ["run", "-A", "main.ts"]]
