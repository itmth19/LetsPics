var sys = require('sys');
var db = require('mysql');
var my_http = require('http');
var url = require('url');
var sendpic = require('./sendpic');

/* Variables */
var port ='8888';
var db_host = 'localhost';
var db_user = 'root';
var db_pass = 'root';
var db_name = 'letspic';
var db_port = '3306';

var upload_dir = '/pics';
var pic_name = '[sender]_[receiver]_[date].jpg';

/*Database connection*/
var cnn = db.createConnection({
  "hostname":db_host,
  "user":db_user,
  "password":db_pass,
  "database":db_name,
  "port":db_port
});

cnn.connect();

/*Handle database connection close*/
cnn.on('close',function(error){
  if(error){
    console.log('Connection closed unexpectedly!');
  }else{
    cnn.createConnection(cnn.config);
  }
});

/*Create server*/
my_http.createServer(function(req,res){
  sys.puts('Request received!');
   responseTo(req,res);
}).listen(port);

sys.puts("Server is listening on port" + port);

/*Reponse*/
function responseTo(req,res){
  var header = '';
  var body = '';
  var url_params = url.parse(req.url,true);
  var query = url_params.query;


  /*switch params*/
  switch(url_params.pathname){
    case "/":
      sys.puts('Index');
      returnSuccess(res);
      break;
      
    case "/user":
      getUserInfo(query["user_id"],res);
      break;

    case "/user/send/pic":
      /*if is post request*/
      if (req.method.toLowerCase() == 'post'){
        uploadFile(req,res);
      }
      break;

    case "/user/like/pic":
      likeAPicture(query["user_id"],query["pic_id"],res);
      break;

    /*case "/user/update/message":
    case "/user/send/message":
    case "/user/get/friends":*/
  }
}

function getUserInfo(id,res){
  var result = '';
  var query = "SELECT * FROM tbl_users ";
  query += "WHERE ID = " + db.escape(id);
  cnn.query(query,function(error,rows,fields){
    if(error){
        returnError(res);
    } 
    else{
      /*get the result*/ 
        result = JSON.stringify(rows[0]);
        returnJsonString(result,res);
    }
  });
}

function getFriendsList(id,limit_number){
  //get user from different countries
  var user = JSON.parse(getUserInfo(id));
  var result = '';
  var result = {};
  var query = "SELECT * FROM tbl_users ";
  query += "WHERE ID = " + db.escape(id) + " ";
  query += "AND country <> " + user["nationality"] + " "; /*set different coutries*/
  query += "ORDER BY RAND() LIMIT " + limit_number;
  cnn.query(query,function(error,rows,fields){
    if(error) throw "ERROR";
    result = rows;
  });
  
  return JSON.stringify(result);
}

function makeFriendWith(user_id,friend_id){
  var query = '';
  query +="SELECT * FROM tbl_pics "
  cnn.query(query,function(error,rows,fields){
    if(error) throw "ERROR";
    result = rows;
  });
}

function checkIfLikeTwice(user_id,friend_id){
  
}

function sendMessage(user_id,friend_id,message){
  /*send message from user to friend*/

  /*add updates to friend's updates*/
  
  /*add updates to user's updates*/
}

function likeAPicture(user_id,pic_id,res){/*作成中*/
  var query = '';
  
  /*save in to tbl_pics*/
  var result = {};
  var query = "UPDATE tbl_pics ";
  query +="SET liked = " + db.escape('1');
  query += " WHERE ID = " + db.escape(pic_id);
  cnn.query(query,function(error,rows,fields){
    if(error){
      returnSuccess(res);
    }
    else{
      //add updates to user
      addUpdatesPhotoLiked(user_id,'pic',pic_id,user_id,res);
    } 
  });
}

function addUpdatesPhotoLiked(user_id,_type,pic_id,friend_id,res){/*作成中*/
  /*save in to tbl_user_id_updates*/
  var result = {};
  var post = {type:_type, info:friend_id, checked: '0', init_date: new Date().toJSON().slice(0,10) };
  var query = "INSERT INTO tbl_user_" + user_id + "_updates ";
  query +=" SET ? ";
  cnn.query(query,[post],function(error,rows,fields){
    if(error){
      sys.puts(error);
      returnError(res);
    }
    else{
      returnSuccess(res);
    } 
  });
}


function userRegistration(facebook_id,nationality,gener){
  var query = '';
  query = "INSERT IGNORE INTO tbl_users (FacebookID, country, sex) VALUES (";
  query += db.escape(facebook_id) + ", '";
  query += db.escape(nationality) + "', '";
  query += db.escape(gener) + "');";
  cnn.query(query,function(error,fields){
    if(error) throw "ERROR";
  });
  
}

function returnError(res){
  res.writeHeader(404,{"Content-Type":"text/plain"});
  res.write('Not found');
  res.end();
}

function returnSuccess(res){
  res.writeHead(200, {'content-type': 'text/plain'});
  res.write('OK');
  res.end();
}

function returnJsonString(json_string,res){
  res.writeHead(200, {'content-type': 'text/plain'});
  res.write(json_string);
  res.end();
}

function uploadFile(req,res){
  /*upload file code*/
  var form = new formidable.IncomingForm();
  form.uploadDir = upload_dir;

  form.on('error',function(error){
    res.writeHeader(404,{"Content-Type":"text/plain"});
    res.write('ERROR');
    res.end();
  });

  /*override the events when finish uploading*/
  form.on('end',function(error){
    returnSuccess(res);
  });

  form.parse(req, function(err,fields,files){
    returnSuccess(res);
  });

  return;
}



