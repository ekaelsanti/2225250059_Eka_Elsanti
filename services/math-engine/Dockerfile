# API mesin matematika GradieKAn (fitur online F-31).
# Build:  docker build -t gradiekan-engine services/math-engine
# Jalan:  docker run -p 8000:8000 -e GRADIEKAN_ALLOWED_ORIGINS=https://domain-aplikasi gradiekan-engine
FROM python:3.12-slim

WORKDIR /app
COPY pyproject.toml ./
COPY mathengine ./mathengine
RUN pip install --no-cache-dir .

ENV GRADIEKAN_RATE_LIMIT=60
EXPOSE 8000
# --no-access-log: isi dan jejak permintaan siswa tidak dicatat
CMD ["uvicorn", "mathengine.api:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
