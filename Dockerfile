# Use the official Jupyter base image as a starting point
FROM jupyter/scipy-notebook:latest

# Set the working directory inside the container
WORKDIR /home/jovyan

# Copy the environment.yml file into the container
COPY environment.yml /home/jovyan/environment.yml

# Install conda environment using the environment.yml file
RUN conda env create -f /home/jovyan/environment.yml

# Activate the environment and install JupyterLab
RUN echo "conda activate myenv" >> ~/.bashrc

# Expose the port for JupyterLab
EXPOSE 8888

# Start JupyterLab when the container starts
CMD ["start-notebook.sh", "--NotebookApp.token=''", "--NotebookApp.port=8888"]
