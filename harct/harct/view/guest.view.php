<?php
require "include/header.inc.php";
?>

    <div class="container-fluid px-0 ">

        <!-- search field-->
        <div class="container-fluid p-0 my-2 " style="background: #1d2331;">

            <form class="d-flex p-0 "  role="search">

                <input 
                class="form-control me-2 bg-transparent border border-success text-white shadow-none searchbar" 
                type="search" 
                placeholder="Search" 
                aria-label="Search"
                >

                <button class="btn btn-outline-success" type="submit">Search</button>

            </form>

        </div>


        <div class="container-fluid p-0">
            <table class="container-fluid " style="background: #1d2331;">
            <thead>
                <tr>
                    <th class="py-3 ps-2" scope="col">Guest Name</th>
                    <th class="py-3 ps-2" scope="col">Guest Email</th>
                    <th class="py-3 ps-2" scope="col">Guest Number</th>
                    <th class="py-3 ps-2" scope="col">Guest Age</th>
                    <th class="py-3 ps-2" scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <!--- static data -->
                <tr>
                    <td class="pb-2 ps-2">Juan Dela Cruz</td>
                    <td class="pb-2 ps-2">juan@gmail.com</td>
                    <td class="pb-2 ps-2">09123412333</td>
                    <td class="pb-2 ps-2">21</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">pedro Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09563412564</td>
                    <td class="pb-2 ps-2">21</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                    
                </tr>
                <tr>
                    <td class="pb-2 ps-2">Josh Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09000000001</td>
                    <td class="pb-2 ps-2">31</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">Maxi Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09876543211</td>
                    <td class="pb-2 ps-2">45</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">renz Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09111113332</td>
                    <td class="pb-2 ps-2">43</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">renz Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09111113332</td>
                    <td class="pb-2 ps-2">43</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">renz Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09111113332</td>
                    <td class="pb-2 ps-2">43</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">renz Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09111113332</td>
                    <td class="pb-2 ps-2">43</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>
                <tr>
                    <td class="pb-2 ps-2">renz Dela Cruz</td>
                    <td class="pb-2 ps-2">example@gmail.com</td>
                    <td class="pb-2 ps-2">09111113332</td>
                    <td class="pb-2 ps-2">43</td>

                    <td class="pb-2 ps-2">
                         <button class=" btn btn-outline-primary"><i class="fa-solid fa-list-check"></i></button>   <!--modify button -->
                         <button class=" btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>        <!--delete button -->
                    </td>
                </tr>

            </tbody>
            </table>
        </div>
    </div>

    <div class="position-fixed bottom-0 end-0 col-4 me-3">
        <div id="add-guest" 
            class="col-12 mb-3 me-1 px-4 d-none border border-primary" 
            style="background:#1d2331; z-index:99; ">
            <form method="post" class="col-12 p-4 m-0">
                <h1 class="mb-4">Add Guest</h1>
                <div class="row">
                    <div class="col-12 mb-3">
                        <input 
                        type="fullname" 
                        class="form-control" 
                        placeholder="fullname"
                        >
                    </div>
                    <div class="col-12 mb-3">
                        <input 
                        type="number" 
                        class="form-control" 
                        placeholder="number"
                        >
                    </div>
                
                
                    <div class="col-12 mb-3">
                        <input 
                        type="email" 
                        class="form-control" 
                        placeholder="email"
                        >
                    </div>
                    <div class="col-12 mb-3">
                        <input 
                        type="number" 
                        class="form-control" 
                        placeholder="age"
                        >
                    </div>
                </div>
                <div>
                    <button type="submit" class="btn btn-primary ">Submit</button>
                </div>
            </form>
        </div>


        <button 
            class="btn text-center px-4 py-3 mb-3  text-white rounded rounded-circle"
            style=" aspect-ratio:1/1; background-color: #f83e42; float:right;"
            id="add-guest-btn"
            role="button">

            <i class="fa-solid fa-plus"></i>

        </button>
    </div>


<script scoped src="assets/js/addguestbtn.js"></script>
<?php
require("include/footer.inc.php");
?>