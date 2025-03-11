FROM denoland/deno:alpine-2.2.3

WORKDIR /app

COPY . .
RUN deno cache main.ts

USER deno
ENTRYPOINT [ "deno" ]
CMD ["run", "-A", "main.ts"]]
