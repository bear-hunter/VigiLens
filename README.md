# Set up for flask

1. Just create the folders

2. navigate to the correct directory and python -m venv venv

3. pip install -r requirements.txt

# Set up for front-end

# 1. Go to your project's root folder

cd /home/vectors/Softwares/vigilens-app/

# 2. Remove the old, empty folder

rm -rf frontend

# 3. Create the React project correctly

npm create vite@latest frontend -- --template react

# 4. Go into the new folder

cd frontend

# 5. Install all dependencies (basic + specific)

npm install
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled react-player
