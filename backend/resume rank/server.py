from flask import Flask, render_template, url_for, request, session, redirect, abort, jsonify
from database import mongo
from werkzeug.utils import secure_filename
import os,re
import spacy, fitz,io
from bson.objectid import ObjectId
from flask_cors import CORS
import docx2txt
from datetime import datetime
from fuzzywuzzy import fuzz
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/Jobportal'
mongo = PyMongo(app)

# Expose mongo to other modules
app.mongo = mongo

UPLOAD_FOLDER_RESUME = 'static/uploaded_resumes'
UPLOAD_FOLDER_JOB = 'static/Job_Description'
app.config['UPLOAD_FOLDER_RESUME']=UPLOAD_FOLDER_RESUME
app.config['UPLOAD_FOLDER_JOB']=UPLOAD_FOLDER_JOB
app.config['SERVER_TIMEOUT'] = 300

mongo.init_app(app)

resumeFetchedData = mongo.db.resumedatas
JOBS = mongo.db.jobs
Applied_EMP = mongo.db.Applied_EMP
IRS_USERS = mongo.db.IRS_USERS

###Spacy model
models_loaded = False
def load_models():
    global nlp, jd_model, models_loaded
    if not models_loaded:
      print("Loading Resume Parser model...")
      nlp = spacy.load('assets/ResumeModel/output/model-best')
      print("Resune Parser model loaded")
      print("Loading Jd Parser model...")
      jd_model = spacy.load('assets/JdModel/output/model-best')
      print("Jd Parser model loaded")
      models_loaded = True
    
ALLOWED_EXTENSIONS = {'docx','pdf', 'txt'}
def allowedExtension(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

def allowedExtensionPdf(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ['pdf']

def extractData(file,ext):
    text=""
    if ext=="docx": 
        temp = docx2txt.process(file)
        text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
        text = ' '.join(text)
    if ext=="pdf":
        for page in fitz.open(file):
            text = text + str(page.get_text())
        text = " ".join(text.split('\n'))
    if ext == "txt":
      with open(file, 'r', encoding='utf-8') as f:
         text = f.read()
    return text

@app.route("/uploadResume", methods=['POST'])
def uploadResume():
    try:
        file = request.files['resume']
        filename = secure_filename(file.filename)
        user_id = request.headers.get("User-ID");
        
        if file and allowedExtension(file.filename):
           
            
            file.save(os.path.join(app.config['UPLOAD_FOLDER_RESUME'],filename))
            print("Resume Uploaded")
            
            
            fname = "static/uploaded_resumes/"+filename
            print(fname)
            text_of_resume = " "
            if file.filename.lower().endswith(".pdf"):
                doc = fitz.open(fname)
                print("Resume taken as input")
                for page in doc:
                    text_of_resume = text_of_resume + str(page.get_text())
            else:
               text_of_resume = extractData(fname, file.filename.rsplit('.',1)[1].lower()) # If the file is a txt, then we call extract data to get the text
            label_list=[]
            text_list = []
            dic = {}
            
            doc = nlp(text_of_resume)
            for ent in doc.ents:
                label_list.append(ent.label_)
                text_list.append(ent.text)
            
            print("Model work done")

            for i in range(len(label_list)):
                if label_list[i] in dic:
                    # if the key already exists, append the new value to the list of values
                    dic[label_list[i]].append(text_list[i])
                else:
                    # if the key does not exist, create a new key-value pair
                    dic[label_list[i]] = [text_list[i]]
            
            print(dic)
            resume_data_annotated = ''
            for key, value in dic.items():
                for val in value:
                    resume_data_annotated += val + " "
            
            resume_name = dic.get('NAME')
            if resume_name is not None:
                value_name = resume_name[0]
            else:
                value_name = None

            resume_linkedin = dic.get('LINKEDIN LINK')
            if resume_linkedin is not None:
                value_linkedin = resume_linkedin[0]
                value_linkedin = re.sub('\n', '',value_linkedin)
            else:
                value_linkedin= None

            resume_skills = dic.get('SKILLS', []) # Fetch skills, return empty list if none are found
            if resume_skills is not None:                  
                value_skills = resume_skills
            else:
                value_skills = []

            resume_certificate = dic.get('CERTIFICATION',[])
            if resume_certificate:
                value_certificate = resume_certificate
            else:
                value_certificate= []

            resume_workedAs = dic.get('WORKED AS')
            if resume_workedAs is not None:
                value_workedAs = resume_workedAs
            else:
                value_workedAs = None
        
            resume_experience = dic.get('YEARS OF EXPERIENCE', [])# Fetch experience, return empty list if none are found
            if resume_experience is not None:
                value_experience = resume_experience
            else:
                value_experience = []
            
            result = None               
            resume_data = {
              "user": ObjectId(user_id),
              "Name": value_name,
              "LinkedIn": value_linkedin,
              "Skills": value_skills,
              "Certification": value_certificate,
              "WorkedAs": value_workedAs,
              "YEARS OF EXPERIENCE": value_experience,
              "resumeFilePath":fname,
              "uploadedAt": datetime.now()
          }

            resume_data_collection = mongo.db.get_collection("resumedatas"); # Reference the collection name

            result = resume_data_collection.insert_one(resume_data);              
            
            if result == None:
                 return jsonify({'message': "Problem in Resume Data Storage", 'success':False})
            else:
                resume_id= str(result.inserted_id);
                return jsonify({'message': "Resume Screen Successfully!!", 'success':True, 'entities':dic,'resume_id':resume_id})
        else:
                return jsonify({"message":"Document Type Not Allowed","success":False})
    except Exception as e:
        print("Exception Occured in resume Upload", e)
        return jsonify({'error': str(e), "success":False}),500




from fuzzywuzzy import fuzz
def Matching(resume_data, job_desc):
 
    try:
        print("resume data:", resume_data)
        print("job desc:", job_desc)

        # --- Extract Job Description Text ---
        text_of_jd = job_desc.get("descriptionText", "")
        if not text_of_jd:
            jd_data = job_desc.get("descriptionFile")
            if jd_data:
                with io.BytesIO(jd_data) as data:
                    doc = fitz.open(stream=data)
                    for page in doc:
                        text_of_jd += page.get_text()
            else:
                print("Warning: No job description text or file found.")
                return 0  # Return 0 if no JD text is available

        # --- Extract Entities from Job Description (if not already parsed) ---

        dic_jd = job_desc.get('parsedEntities', {})
        if not dic_jd: #only parse if not already parsed
            label_list_jd = []
            text_list_jd = []
            dic_jd = {}

            doc_jd = jd_model(text_of_jd)
            for ent in doc_jd.ents:
                label_list_jd.append(ent.label_)
                text_list_jd.append(ent.text)

            for i in range(len(label_list_jd)):
                if label_list_jd[i] in dic_jd:
                    dic_jd[label_list_jd[i]].append(text_list_jd[i])
                else:
                    dic_jd[label_list_jd[i]] = [text_list_jd[i]]

        print("Jd dictionary:", dic_jd)

        # --- Extract Resume Data ---
        resume_workedAs = resume_data.get('WorkedAs', [])
        resume_experience_list = resume_data.get('YEARS OF EXPERIENCE', [])
        resume_skills = resume_data.get('Skills', [])
        job_description_skills = dic_jd.get('SKILLS', [])
        jd_post = dic_jd.get('JOBPOST', [])

        # --- Similarity Calculations ---

        # 1. Job Post Similarity (Fuzzy Matching)
        jdpost_similarity = 0
        if resume_workedAs and jd_post:
            best_match = 0
            for resume_pos in resume_workedAs:
                for jd_pos in jd_post:
                    similarity = fuzz.partial_ratio(resume_pos.lower(), jd_pos.lower())
                    best_match = max(best_match, similarity)
            jdpost_similarity = best_match / 100.0
            print(f"jdpost_similarity: {jdpost_similarity}")


        # 2. Experience Similarity (Improved Extraction)
        resume_experience_years = []
        for exp_str in resume_experience_list:
            try:
                years = float(re.search(r"(\d+(\.\d+)?)", exp_str).group(1))
                resume_experience_years.append(years)
            except (AttributeError, ValueError):
                # More robust NLP-based experience extraction would go here (e.g., spaCy's rule-based matching)
                pass  # For now, ignore extraction failures

        print("resume_experience_years:", resume_experience_years)

        experience_similarity = 0
        if resume_experience_years and jd_post:
            # (Add logic to extract experience requirement from job description if needed)
            job_required_experience = 0  # Replace with experience extraction from job description
            if len(resume_experience_years) > 0 and job_required_experience > 0:
                if abs(resume_experience_years[0] - job_required_experience) <= 2:
                    experience_similarity = 0.7
                elif resume_experience_years[0] > job_required_experience:
                    experience_similarity = 1
        
        print(f"experience_similarity: {experience_similarity}")


        # 3. Skills Similarity (Partial Matching)
        skills_similarity = 0
        if resume_skills and job_description_skills:
            matches = 0
            for resume_skill in resume_skills:
                for job_skill in job_description_skills:
                    if fuzz.partial_ratio(resume_skill.lower(), job_skill.lower()) >= 70:
                        matches += 1
                        break
            skills_similarity = matches / len(job_description_skills) if len(job_description_skills) > 0 else 0

            print(f"skills_similarity: {skills_similarity}")


        # --- Calculate Overall Similarity ---
        overall_similarity = (jdpost_similarity * 0.3 + experience_similarity * 0.2 + skills_similarity * 0.5) * 100
        print(f"overall_similarity: {overall_similarity}")

        return round(overall_similarity, 2)

    except Exception as e:
        print("Error in matching:", e)
        return 0


@app.route("/match", methods=['POST'])
def match():
    try:
        data = request.get_json()
        print(data);
        resume_data = data.get('resume_data')
        job_desc = data.get('job_desc')

        if not resume_data or not job_desc:
             return jsonify({'error': 'Missing resume or job description data', "success":False}), 400


        match_score= Matching(resume_data,job_desc);
        return jsonify({'match_score': match_score,"success":True}), 200
    except Exception as e:
        print("Error processing match request:",e);
        return jsonify({'error': str(e), "success":False}), 500

@app.route("/uploadJobDescription", methods=['POST'])
def uploadJobDescription():
    try:
        file = request.files['jobDescription']
        filename = secure_filename(file.filename)
        
        if file and allowedExtension(file.filename):

            job_id = ObjectId()
            path = os.path.join(app.config['UPLOAD_FOLDER_JOB'],str(job_id))
            os.mkdir(path)

            file.save(os.path.join(path, filename))
            fetchedData = extractData(path+"/"+filename,file.filename.rsplit('.',1)[1].lower())
            print("Jd Uploaded")
          
                
            label_list_jd=[]
            text_list_jd = []
            dic_jd = {}

            doc_jd = jd_model(fetchedData)
            for ent in doc_jd.ents:
                label_list_jd.append(ent.label_)
                text_list_jd.append(ent.text)

            print("Model work done")

            for i in range(len(label_list_jd)):
                if label_list_jd[i] in dic_jd:
                # if the key already exists, append the new value to the list of values
                    dic_jd[label_list_jd[i]].append(text_list_jd[i])
                else:
                # if the key does not exist, create a new key-value pair
                    dic_jd[label_list_jd[i]] = [text_list_jd[i]]


            print("Jd dictionary:",dic_jd)


            return jsonify({'success':True,'message':"Job description uploaded successfully",'entities':dic_jd, "jobId": str(job_id), 'descriptionText':fetchedData, 'descriptionFile':os.path.join(path,filename)})
            
        else:
           return jsonify({'message': "Document Type Not Allowed","success":False}),400

    except Exception as e:
        print(e);
        return jsonify({'error': str(e), "success":False}), 500

if __name__ == '__main__':
    load_models()
    app.run(host="0.0.0.0", port=6466, debug=True)
