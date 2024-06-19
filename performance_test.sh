#!/bin/bash

build_times=10;
build_costs_total=0;
dump_file="./build_cost.dump";
build_log_file="./build_log.dump";

build_test(){
  build_start="`date +%s`";
  npm run build >> $build_log_file;
  build_finish="`date +%s`";
  build_costs=$((build_finish-build_start));
  ((build_costs_total+=build_costs));

  echo "Build Time: $((10 - build_times + 1))" | tee -a $dump_file;
  echo "Build Start: $build_start" | tee -a $dump_file;
  echo "Build Finish: $build_finish" | tee -a $dump_file;
  echo "Build Costs: $build_costs" | tee -a $dump_file;
  echo "Current Costs Total: $build_costs_total" | tee -a $dump_file;
}

rm -rf $dump_file;

while ((build_times > 0))
do
  build_test;
  ((build_times--))
done

echo "Build Costs Total: $build_costs_total" | tee -a $dump_file;
echo "Build Costs Average: $((build_costs_total / 10))" | tee -a $dump_file;
