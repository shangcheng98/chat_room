mod utils;

extern crate markov;
extern crate serde;
extern crate serde_derive;
#[cfg(feature = "yaml")]
extern crate serde_yaml;

use std::io::{Error, ErrorKind};
use lazy_static::lazy_static;
use markov::Chain;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;
#[cfg(feature = "yaml")]
use serde_yaml as yaml;


struct ChainWrapper {
    chain: markov::Chain<String>
}

impl ChainWrapper {
    fn new() -> ChainWrapper {
        ChainWrapper{
            chain: Chain::new()
        }
    }
    #[allow(dead_code)]
    fn get_chain(&self) -> &Chain<String> {
        return &self.chain;
    }
    fn set_chain(&mut self, new_chain: markov::Chain<String>) {
        self.chain = new_chain;
    }
    fn generate(&self, token: String) -> String {
        return self.chain.generate_str_from_token(&token[..]);
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

lazy_static! {
    static ref CHAIN: Mutex<ChainWrapper> = Mutex::new(ChainWrapper::new());
}

#[wasm_bindgen]
pub fn initialize_chain(init_str: String) {
    console_error_panic_hook::set_once();

    let new_chain: Chain<String>  = yaml::from_str(&init_str[..]).map_err(|e| {
        Error::new(ErrorKind::InvalidInput, e)
    }).unwrap();
    CHAIN.lock().unwrap().set_chain(new_chain);
}

#[wasm_bindgen]
pub fn generate_prediction(token: String) -> String{
    CHAIN.lock().unwrap().generate(token)
}

