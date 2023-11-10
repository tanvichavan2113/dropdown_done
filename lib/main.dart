// import 'package:flutter/material.dart';
// import 'spcresultpage.dart';
// import 'spcresultpage2.dart';

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: MyDropDown(),
//     );
//   }
// }

// class MyDropDown extends StatefulWidget {
//   @override
//   _MyDropDownState createState() => _MyDropDownState();
// }

// class _MyDropDownState extends State<MyDropDown> {
//   String selectedOption = '1';

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Flutter Dropdown App'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             DropdownButton<String>(
//               value: selectedOption,
//               onChanged: (String? newValue) {
//                 // print("Value : $newValue");
//                 setState(() {
//                   selectedOption = newValue!;
//                 });
//               },
//               items: ['1', '2', '3'].map((String value) {
//                 return DropdownMenuItem<String>(
//                   value: value,
//                   child: Text('Option $value'),
//                 );
//               }).toList(),
//             ),
//             SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: () {
//                 if (selectedOption == '1') {
//                   Navigator.push(
//                     context,
//                     MaterialPageRoute(
//                       builder: (context) => SPCResultPage(),
//                     ),
//                   );
//                 } else if (selectedOption == '2') {
//                   Navigator.push(
//                     context,
//                     MaterialPageRoute(
//                       builder: (context) => SPCResultPage2(),
//                     ),
//                   );
//                 }
//               },
//               child: Text('Go to Result Page'),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

/////////////////runned correctly
// import 'package:flutter/material.dart';
// import 'package:shared_preferences/shared_preferences.dart';
// import 'spcresultpage.dart';
// // import 'spcresultpage2.dart';

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: MyDropDown(),
//     );
//   }
// }

// class MyDropDown extends StatefulWidget {
//   @override
//   _MyDropDownState createState() => _MyDropDownState();
// }

// class _MyDropDownState extends State<MyDropDown> {
//   String selectedOption = '1';

//   @override
//   void initState() {
//     super.initState();
//     loadSelectedOption();
//   }

//   void loadSelectedOption() async {
//     SharedPreferences prefs = await SharedPreferences.getInstance();
//     setState(() {
//       selectedOption = prefs.getString('selectedOption') ?? '1';
//     });
//   }

//   void saveSelectedOption(String value) async {
//     SharedPreferences prefs = await SharedPreferences.getInstance();
//     prefs.setString('selectedOption', value);
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Flutter Dropdown App'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             DropdownButton<String>(
//               value: selectedOption,
//               onChanged: (String? newValue) {
//                 print("Value : $newValue");
//                 setState(() {
//                   selectedOption = newValue!;
//                   saveSelectedOption(selectedOption);
//                 });
//               },
//               items: ['1', '2', '3'].map((String value) {
//                 return DropdownMenuItem<String>(
//                   value: value,
//                   child: Text('Option $value'),
//                 );
//               }).toList(),
//             ),
//             SizedBox(height: 20),
//             ElevatedButton(
//               onPressed: () {
//                 _saveData(selectedOption);

//                 Navigator.push(
//                   context,
//                   MaterialPageRoute(
//                     builder: (context) => SPCResultPage(),
//                   ),
//                 );

//                 // if (selectedOption == '1') {

//                 // } else if (selectedOption == '2') {
//                 //   Navigator.push(
//                 //     context,
//                 //     MaterialPageRoute(
//                 //       builder: (context) => SPCResultPage2(),
//                 //     ),
//                 //   );
//                 // }
//               },
//               child: Text('Go to Result Page'),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   _saveData(String spc_data) async {
//     SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
//     sharedPreferences.setString("spc_option", spc_data);
//   }
// }
/////////////////runned successfully

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'spcresultpage.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyDropDown(),
    );
  }
}

class MyDropDown extends StatefulWidget {
  @override
  _MyDropDownState createState() => _MyDropDownState();
}

class _MyDropDownState extends State<MyDropDown> {
  String selectedOption = '1';

  @override
  void initState() {
    super.initState();
    loadSelectedOption();
  }

  void loadSelectedOption() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      setState(() {
        selectedOption = prefs.getString('selectedOption') ?? '1';
      });
    } catch (e) {
      print('Error loading selected option: $e');
    }
  }

  void saveSelectedOption(String value) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('selectedOption', value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter Dropdown App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            DropdownButton<String>(
              value: selectedOption,
              onChanged: (String? newValue) {
                print("Value : $newValue");
                setState(() {
                  selectedOption = newValue!;
                  saveSelectedOption(selectedOption);
                });
              },
              items: ['1', '2', '3'].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text('Option $value'),
                );
              }).toList(),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                _saveData(selectedOption);

                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SPCResultPage(),
                  ),
                );
              },
              child: Text('Go to Result Page'),
            ),
          ],
        ),
      ),
    );
  }

  _saveData(String spcData) async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    sharedPreferences.setString("spc_option", spcData);
  }
}
