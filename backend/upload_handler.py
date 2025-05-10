import pandas as pd
from sqlalchemy import create_engine
import logging

def process_excel(file, db_uri):
    try:
        # Read Excel file
        df = pd.read_excel(file)
        
        # Validate required columns
        required_columns = ['ИНН', 'Название организации', 'Контактное лицо']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise ValueError(f"Missing columns: {', '.join(missing)}")
        
        # Clean data
        df = df.dropna(subset=['ИНН'])
        df['ИНН'] = df['ИНН'].astype(str).str.strip()
        
        # Save to DB
        engine = create_engine(db_uri)
        with engine.connect() as conn:
            df.to_sql('clients', conn, if_exists='append', index=False)
        
        return {
            "total": len(df),
            "sample": df.head(3).to_dict(orient='records')
        }

    except Exception as e:
        logging.error(f"Processing error: {str(e)}")
        raise