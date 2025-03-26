<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Requirement Checker</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: #f5e8d0;
            color: #5a4a3f;
            background-image: url("oldmap.png");
        }
        
        h1 {
            color: #8b5a2b;
            margin-bottom: 5px;
            text-align: center;
            font-size: 28px;
            font-family: 'Bookman Old Style', serif;
            letter-spacing: 1px;
        }
        
        .subheading {
            text-align: center;
            font-style: italic;
            margin-bottom: 20px;
            color: #a67c52;
        }
        
        .container {
            background-color: #f2e8d7;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(138, 109, 59, 0.15);
            border: 1px solid #e6d2b5;
            position: relative;
            overflow: hidden;
            opacity: 0.85;
        }
        
        .message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            position: relative;
            z-index: 1;
        }
        
        .error {
            background-color: #f8e1d0;
            color: #8b4513;
            border-left: 4px solid #c87f0a;
        }
        
        .success {
            background-color: #e8f0d4;
            color: #4b5320;
            border-left: 4px solid #8b9a47;
        }
        
        .travel-icon {
            text-align: center;
            font-size: 40px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .return-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #8b5a2b;
            text-decoration: none;
            font-weight: bold;
        }
        
        .return-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="travel-icon">✈️ 🗺️</div>
        <h1>Travel Visa Checker</h1>
        <p class="subheading">Quick visa information for your next adventure!</p>

        <?php
        if (isset($_POST['country'])) {
            $country = $_POST['country'];
            
            // Determine visa requirements based on selected country
            switch ($country) {
                case 'USA':
                    $message = '🇺🇸 Visa required for most applicants.';
                    $class = 'success';
                    break;
                case 'Canada':
                    $message = '🇨🇦 Visa required unless you have an eTA.';
                    $class = 'success';
                    break;
                case 'India':
                    $message = '🇮🇳 Visa required before travel.';
                    $class = 'success';
                    break;
                case 'UK':
                    $message = '🇬🇧 Visa depends on the duration of stay.';
                    $class = 'success';
                    break;
                case 'Australia':
                    $message = '🇦🇺 eVisa available for eligible travelers.';
                    $class = 'success';
                    break;
                default:
                    $message = '⚠️ Invalid country selection.';
                    $class = 'error';
            }
            
            // Display the result
            echo "<div class='message $class'>$message</div>";
        } else {
            // No country selected
            echo "<div class='message error'>⚠️ Please select a country.</div>";
        }
        ?>

        <a href="visa_check.html" class="return-link">← Back to Visa Checker</a>
    </div>
</body>
</html>