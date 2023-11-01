<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $header  ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Italianno&family=Open+Sans:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body class="p-0 m-0" ">

    <div style="max-width: 2000px; margin: auto;">

            <div class="d-flex" style="height:100vh;">

            <?php require_once("aside.inc.php");?>

            <div class="container-fluid">

                    <header class="container-fluid p-2 text-light bg-header" style="height:10vh;">

                        <div class="d-flex align-items-center justify-content-between pt-3">

                            <div class="d-flex align-items-center">

                                <span id="navbarbtn" class="fs-5 ps-2 pe-4 pb-1">

                                    <i class="fa-solid fa-bars" style="cursor:pointer;"></i>

                                </span>
                                
                                <h1 class="text-light fs-4 fw-bolder"><?= $header ?></h1>
                                
                            </div>

                            <div class="pb-2">

                                <span id="datetime"></span>

                            </div>
                            
                        </div>

                    </header>

                    <main class="text-light">