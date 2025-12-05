FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y unixodbc-dev curl gnupg netcat-openbsd && curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/ubuntu/22.04/prod jammy main' > /etc/apt/sources.list.d/mssql-release.list && apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 && rm -rf /var/lib/apt/lists/*
# Ensure the msodbcsql driver is registered and library path available for pyodbc fallback
RUN echo "[ODBC Driver 17 for SQL Server]" > /etc/odbcinst.ini \
 && echo "Description=Microsoft ODBC Driver 17 for SQL Server" >> /etc/odbcinst.ini \
 && echo "Driver=/usr/lib/libmsodbcsql-17.so" >> /etc/odbcinst.ini \
 && echo "Threading=1" >> /etc/odbcinst.ini || true

ENV LD_LIBRARY_PATH="/usr/lib:${LD_LIBRARY_PATH}"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
