<?php

class Dbh 
{
    private $hostname = "localhost";
    private $dbasename = "user";
    private $username = "root";
    private $password = "";

    public function connect()
    {
        try{
            $dsn = "mysql:host=$this->hostname;dbname=$this->dbasename;";
            $pdo = new PDO($dsn, $this->username,$this->password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
            return $pdo;
        }catch(PDOException $e){
            $errmsg = "Connection Error: " . $e->getMessage();
            include "error.php";
            exit();
        }
    }
}
