use chesterfield::sync::Database;
use reqwest::blocking::Client;
use reqwest::StatusCode;
use serde_json::{Value, Error, from_str};
use std::env;

pub struct Context {
    pub host: String,
    pub name: String,
    pub namespace: String,
    db: Database,
    user: String,
    pass: String
}


#[cfg(test)]
impl Context {
    pub fn new(db: Database, auth: &str) -> Self {
        let auth: Vec<&str> = auth.split(":").collect();
        Context { host: "host.docker.internal".to_string(), db, name: "action".to_string(), namespace: "guest".to_string(), user: auth[0].to_string(), pass: auth[1].to_string() }
    }

    pub fn insert_document(&mut self, mut doc: Value) -> Result<String, String> {
        match self.db.insert(&mut doc, None).send() {
            Ok(r) => {
                return Ok(r.id)
            }
            Err(err) => return Err(format!("error creating document {}: {:?}", doc, err)),
        };
    }

    pub fn get_document(&self, id: &str) -> Result<Value, Error> {
        match self.db.get(id).send::<Value>() {
            Ok(v) => return Ok(v.into_inner().unwrap()),
            Err(err) => return Err(format!("error fetching document {}: {:?}", id, err)).map_err(serde::de::Error::custom),
        }
    }

    pub fn create_trigger(&self, name: &str) -> Result<Value, Error> {
        let client = Client::new();
        if let Ok(response) = client.put(format!("{}/api/v1/namespaces/{}/triggers/{}?overwrite=true", self.host, self.namespace, name)).basic_auth(self.user.clone(), Some(self.pass.clone())).send() {
            match response.status() {
                StatusCode::OK => return from_str(&response.text().unwrap()),
                _ => return Err(format!("failed to create trigger {}", name)).map_err(serde::de::Error::custom)
            }
        };
        Err(format!("failed to create trigger {}", name)).map_err(serde::de::Error::custom)
    }
}

#[cfg(not(test))]
impl Context {
    pub fn new(db: Database, auth: &str) -> Self {
        let auth: Vec<&str> = auth.split(":").collect();
        let host = if env::var("__OW_API_HOST").is_ok() {
            env::var("__OW_API_HOST").unwrap()
        } else {
            "host.docker.internal".to_string()
        };
        let name = if env::var("__OW_ACTION_NAME").is_ok() {
            env::var("__OW_ACTION_NAME").unwrap()
        } else {
            "action".to_string()
        };
        let namespace = if env::var("__OW_NAMESPACE").is_ok() {
            env::var("__OW_NAMESPACE").unwrap()
        } else {
            "guest".to_string()
        };
        Context { host, db, name, namespace, user: auth[0].to_string(), pass: auth[1].to_string() }
    }

    pub fn create_trigger(&self, name: &str) -> Result<Value, Error> {
        let client = Client::new();
        if let Ok(response) = client.put(format!("{}/api/v1/namespaces/{}/triggers/{}?overwrite=true", self.host, self.namespace, name)).basic_auth(self.user.clone(), Some(self.pass.clone())).send() {
            match response.status() {
                StatusCode::OK => return from_str(&response.text().unwrap()),
                _ => return Err(format!("failed to create trigger {}", name)).map_err(serde::de::Error::custom)
            }
        };
        Err(format!("failed to create trigger {}", name)).map_err(serde::de::Error::custom)
    }

    pub fn insert_document(&mut self, mut doc: Value) -> Result<String, String> {
        match self.db.insert(&mut doc, None).send() {
            Ok(r) => {
                return Ok(r.id)
            }
            Err(err) => return Err(format!("error creating document {}: {:?}", doc, err)),
        };
    }

    pub fn get_document(&self, id: &str) -> Result<Value, Error> {
        match self.db.get(id).send::<Value>() {
            Ok(v) => return Ok(v.into_inner().unwrap()),
            Err(err) => return Err(format!("error fetching document {}: {:?}", id, err)).map_err(serde::de::Error::custom),
        }
    }
}