// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:shared_preferences/shared_preferences.dart';

// class SPCResultPage extends StatefulWidget {
//   const SPCResultPage({super.key});

//   @override
//   State<SPCResultPage> createState() => _SPCResultPageState();
// }

// class _SPCResultPageState extends State<SPCResultPage> {
//   get selectedSampleSize => null;

//   String? selectData = "";

//   Future<List<dynamic>> fetchData(String sampleSize) async {
//     final response = await http.post(
//       Uri.parse('http://localhost:3001/calculate'),
//       headers: {'Content-Type': 'application/json'},
//       body: jsonEncode({'sampleSize': sampleSize}),
//     );

//     if (response.statusCode == 200) {
//       return jsonDecode(response.body);
//     } else {
//       throw Exception('Failed to load data');
//     }
//   }

//   @override
//   void initState() {
//     // TODO: implement initState
//     super.initState();
//     _getData();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('SPC Result App'),
//       ),
//       body: FutureBuilder(
//         future: fetchData(selectData ?? ''), // Pass the selected sample size
//         builder: (context, snapshot) {
//           if (snapshot.connectionState == ConnectionState.waiting) {
//             return const Center(child: CircularProgressIndicator());
//           } else if (snapshot.hasError) {
//             return Center(child: Text('Error: ${snapshot.error}'));
//           } else {
//             // Display your data using snapshot.data
//             List<dynamic> data = snapshot.data as List<dynamic>;

//             return ListView.builder(
//               itemCount: 1,
//               itemBuilder: (context, index) {
//                 return ListTile(
//                   title: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Text('X bar: ${data[index]['xbar']}'),
//                       Text('Stdev Overall ${data[index]['sd']}'),
//                       Text('Pp: ${data[index]['pp']}'),
//                       Text('Ppu: ${data[index]['ppu']}'),
//                       Text('Ppl: ${data[index]['ppl']}'),
//                       Text('Ppk: ${data[index]['ppk']}'),
//                       Text('Rbar: ${data[index]['rbar']}'),
//                       Text('Stdev Within: ${data[index]['sdw']}'),
//                       Text('Cp: ${data[index]['cp']}'),
//                       Text('Cpu: ${data[index]['cpu']}'),
//                       Text('Cpl: ${data[index]['cpl']}'),
//                       Text('Cpk: ${data[index]['cpk']}'),
//                       Text('ucl: ${data[index]['ucl']}'),
//                       Text('lcl: ${data[index]['lcl']}'),
//                     ],
//                   ),
//                 );
//               },
//             );
//           }
//         },
//       ),
//     );
//   }

//   _getData() async {
//     SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
//     selectData = sharedPreferences.getString("spc_option") ?? "0";
//     print("Selected Data : $selectData");
//     setState(() {});
//   }
// }

// class SPCResultPage extends StatelessWidget {
//   const SPCResultPage({Key? key});

//   get selectedSampleSize => null;

//   Future<List<dynamic>> fetchData(String sampleSize) async {
//     final res = await http.post(
//       Uri.parse('http://localhost:3001/calculate-spc'),
//       headers: {'Content-Type': 'application/json'},
//       body: jsonEncode({'sampleSize': sampleSize}),
//     );

//     if (res.statusCode == 200) {
//       return jsonDecode(res.body);
//     } else {
//       throw Exception('Failed to load data');
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return
//      Scaffold(
//       appBar: AppBar(
//         title: const Text('SPC Result App'),
//       ),
//       body: FutureBuilder(
//         future: fetchData(
//             selectedSampleSize ?? ''), // Pass the selected sample size
//         builder: (context, snapshot) {
//           if (snapshot.connectionState == ConnectionState.waiting) {
//             return const Center(child: CircularProgressIndicator());
//           } else if (snapshot.hasError) {
//             return Center(child: Text('Error: ${snapshot.error}'));
//           } else {
//             // Display your data using snapshot.data
//             List<dynamic> data = snapshot.data as List<dynamic>;

//             return ListView.builder(
//               itemCount: 1,
//               itemBuilder: (context, index) {
//                 return ListTile(
//                   title: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Text('X bar: ${data[index]['xbar']}'),
//                       Text('Stdev Overall ${data[index]['sd']}'),
//                       Text('Pp: ${data[index]['pp']}'),
//                       Text('Ppu: ${data[index]['ppu']}'),
//                       Text('Ppl: ${data[index]['ppl']}'),
//                       Text('Ppk: ${data[index]['ppk']}'),
//                       Text('Rbar: ${data[index]['rbar']}'),
//                       Text('Stdev Within: ${data[index]['sdw']}'),
//                       Text('Cp: ${data[index]['cp']}'),
//                       Text('Cpu: ${data[index]['cpu']}'),
//                       Text('Cpl: ${data[index]['cpl']}'),
//                       Text('Cpk: ${data[index]['cpk']}'),
//                       Text('ucl: ${data[index]['ucl']}'),
//                       Text('lcl: ${data[index]['lcl']}'),
//                     ],
//                   ),
//                 );
//               },
//             );
//           }
//         },
//       ),
//     );
//   }
// }

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SPCResultPage extends StatefulWidget {
  const SPCResultPage({Key? key}) : super(key: key);

  @override
  State<SPCResultPage> createState() => _SPCResultPageState();
}

class _SPCResultPageState extends State<SPCResultPage> {
  String? selectedOption = "";

  Future<List<dynamic>> fetchData(String selectedOption) async {
    final response = await http.post(
      Uri.parse('http://localhost:3001/calculate'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'selectedOption': selectedOption}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load data');
    }
  }

  @override
  void initState() {
    super.initState();
    _getData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SPC Result App'),
      ),
      body: FutureBuilder(
        future: fetchData(selectedOption ?? ''),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            List<dynamic> data = snapshot.data as List<dynamic>;

            return ListView.builder(
              itemCount: 1,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('X bar: ${data[index]['xbar']}'),
                      Text('Stdev Overall ${data[index]['sd']}'),
                      Text('Pp: ${data[index]['pp']}'),
                      Text('Ppu: ${data[index]['ppu']}'),
                      Text('Ppl: ${data[index]['ppl']}'),
                      Text('Ppk: ${data[index]['ppk']}'),
                      Text('Rbar: ${data[index]['rbar']}'),
                      Text('Stdev Within: ${data[index]['sdw']}'),
                      Text('Cp: ${data[index]['cp']}'),
                      Text('Cpu: ${data[index]['cpu']}'),
                      Text('Cpl: ${data[index]['cpl']}'),
                      Text('Cpk: ${data[index]['cpk']}'),
                      Text('ucl: ${data[index]['ucl']}'),
                      Text('lcl: ${data[index]['lcl']}'),
                    ],
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }

  _getData() async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    selectedOption = sharedPreferences.getString("spc_option") ?? "0";
    print("Selected Data : $selectedOption");
    setState(() {});
  }
}
