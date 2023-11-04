<?php


class Router
{

    public $handled = false;

    public function handle($method = 'GET', $path = '/', $filename = '')
    {
        $Method = $_SERVER['REQUEST_METHOD'];
        $Uri = parse_url($_SERVER['REQUEST_URI']);
        
        if($Method !== $method)
        {
            return false;
        }

        $root = '/harct';
        $pattern = '#^' . $root . $path . '$#siD';

        if(preg_match($pattern, $Uri['path'])){
        
            if(file_exists($filename))
            {   
                $this->handled = true;
                require_once $filename;
                return true;
            }
        }
        return false;
    }

    public function __destruct()
    {
        if(!$this->handled){
            require(__DIR__ . DIRECTORY_SEPARATOR . "../view/notfound.view.php");
            exit();
        }
    }
}