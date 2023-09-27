FROM denoland/deno:1.37.0

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
ADD main.ts .
RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "main.ts"]